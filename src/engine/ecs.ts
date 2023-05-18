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

import type Game from "../main";
import { type Room } from "./room";

export type Entity = number;

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
    Tick,
    Keyboard, // keydown and keyup
    KeyUp, // keyup only
    Click,
    RightClick
}

/* 
 * The System Class
 *
 * When a system is triggered it will use the update method to update all
 * entities with the required components. The update method must overlap with
 * the SystemFunc type, which it defaults to.
 */

type SystemFunc = (game: Game, enity: Entity) => void;

export abstract class System {
    requiredComponents: Component[] = [];
    trigger: SystemTrigger;
    update: SystemFunc;

    constructor(
        requiredComponents: Component[],
        trigger: SystemTrigger,
        update: SystemFunc
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

        // for each system with the specified trigger
        for (const system of systems) {
            for (
                const entity of this.game.ecs.entitiesWithComponents(
                    this.game.currentRoom,
                    system.requiredComponents
                )
            ) {
                system.update(this.game, entity);
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

    // add an entity with a unique ID
    createEntity(): Entity {
        let entityId = this.entities.length;

        // find the next available entity ID if the current one is taken
        while (this.entities.includes(entityId)) {
            entityId++;
        }

        // add the entity to the list of entities
        this.entities.push(entityId);

        return entityId;
    }

    // remove an entity and all of its components
    removeEntity(entity: Entity): void {
        this.entities.splice(this.entities.indexOf(entity), 1);
        for (const componentManager of this.componentManagers.values()) {
            if (componentManager.components[entity]) {
                componentManager.removeComponent(entity);
            }
        }
    }

    // brings an entity to the end of the list of entities so it's rendered on top
    bringToFront(entity: Entity): void {
        this.entities.splice(this.entities.indexOf(entity), 1);
        this.entities.push(entity);
    }

    hasComponent(entity: Entity, component: Component): boolean {
        return this.componentManagers.get(component)?.getComponent(entity) !== undefined;
    }

    addComponent<T extends new (...args: any[]) => Component>(
        entity: Entity,
        component: T,
        args = <ConstructorParameters<T>>[]
    ): void {
        // if there isn't already a component manager for the component, create one
        if (!this.componentManagers.has(component)) {
            this.componentManagers.set(component, new ComponentManager<T>());
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

    entitiesWithComponents(room: Room, components: Component[]): Entity[] {
        const entities: Entity[] = [];

        for (const entity of room.entities) {
            // assume the entity has all required components until proven otherwise
            let hasComponents = true;

            for (const component of components) { // for each component
                // if the entity doesn't have a required component it shouldn't be added to the list
                if (!this.hasComponent(entity, component)) {
                    hasComponents = false;
                    break;
                }
            }

            if (hasComponents) entities.push(entity);
        }

        return entities;
    }
}