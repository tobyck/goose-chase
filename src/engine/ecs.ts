/* 
 * engine/ecs.ts
 *
 * This file implements a framework for the ECS to built with.
 * Entities are simply stored as numbers representing their ID; and components
 * are tied to them through ComponentManager objects (one for each type
 * of component). Systems are functions which act upon entities with certain
 * components, and are all managed by a SystemManager object. All of these
 * things are wrapped in the ECS class which is used by the game object.
 */

import Game from "../main";

type Entity = number;

// an abstract class for components to extend from for type safety

export abstract class Component { }

// class to manage all components of type T

class ComponentManager<T extends Component> {
    components: { [entity: Entity]: T } = {};

    addComponent(entity: Entity, component: T): void {
        this.components[entity] = component;
    }

    removeComponent(entity: Entity): void {
        delete this.components[entity];
    }

    getComponent(entity: Entity): T {
        return this.components[entity];
    }
}

// enum for all events that can trigger a system to update
// (list can be expanded as more systems are added)

export enum SystemTrigger {
    Render
}

// system class

// when a system is triggered it will use the update method to update 
// all entities with the required components

export class System {
    requiredComponents: Component[] = [];
    trigger: SystemTrigger;
    update: (game: Game, entity: Entity) => void;

    constructor(
        requiredComponents: Component[],
        trigger: SystemTrigger,
        update: (game: Game, entity: Entity) => void
    ) {
        this.requiredComponents = requiredComponents;
        this.trigger = trigger;
        this.update = update;
    }
}

// class to manage all systems active in a room

export class SystemManager {
    game: Game;
    systems: System[] = [];

    constructor(game: Game) {
        this.game = game;
    }

    addSystem(system: System): void {
        this.systems.push(system);
    }

    // when the updateSystems method is called, systems with the specified trigger will update

    updateSystems(trigger: SystemTrigger): void {
        // get all systems with the specified trigger
        const systems = this.systems.filter(system => system.trigger === trigger);

        // get entities in the current room
        const entities = this.game.currentRoom.entities;

        // for each system with the specified trigger
        for (const system of systems) {
            for (const entity of entities) { // for each entity in the room
                // assume the entity has all required components until proven otherwise
                let hasRequiredComponents = true;

                for (const requiredComponent of system.requiredComponents) {
                    // if the entity doesn't have a required component, it shouldn't be updated
                    if (!this.game.ecs.hasComponent(entity, requiredComponent)) {
                        hasRequiredComponents = false;
                        break;
                    }
                }

                // update the entity if it has all required components
                if (hasRequiredComponents) system.update(this.game, entity);
            }
        }
    }
}

// container to hold all ECS related data and useful methods for accessing them

export class ECS {
    entities: Entity[] = [];
    componentManagers = new Map<Component, ComponentManager<any>>();
    systemManager: SystemManager;

    constructor(game: Game) {
        this.systemManager = new SystemManager(game);
    }

    createEntity(): Entity {
        this.entities.push(this.entities.length);
        return this.entities.length - 1;
    }

    removeEntity(entity: Entity): void {
        this.entities.splice(this.entities.indexOf(entity), 1);
    }

    hasComponent(entity: Entity, component: Component): boolean {
        return this.componentManagers.get(component).getComponent(entity) !== undefined;
    }

    addComponent(
        entity: Entity,
        component: new (...args: any[]) => Component,
        args: any[]
    ): void {
        if (!this.componentManagers.has(component)) {
            this.componentManagers.set(component, new ComponentManager());
        }
        this.componentManagers
            .get(component)
            .addComponent(entity, new component(...args));
    }

    getComponent<T extends Component>(
        entity: Entity,
        component: new (...args: any[]) => T
    ): T {
        return this.componentManagers
            .get(component)
            .getComponent(entity);
    }
}