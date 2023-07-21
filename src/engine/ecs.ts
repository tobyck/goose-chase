/* 
 * engine/ecs.ts
 *
 * This file implements a framework for the ECS to built with.
 * Entities are simply stored as numbers representing their ID, and components
 * are tied to them through ComponentManager objects (one for each type
 * of component). Systems are functions which act upon entities with certain
 * components, and are all managed by a SystemManager class. All of these
 * things are wrapped in the ECS class which is used by the game object.
 */

import { isHidden, shouldAlwaysUpdate } from "../helpers";
import type Game from "../game";
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
    RightClick,
    Hit
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
    requiredComponents: Component[] = []; // what components an entity must have to be updated
    trigger: SystemTrigger; // when the system should update
    update: SystemFunc; // the function to run when the system is triggered

    ignoreAUC = false; // short for ignore AlwaysUpdateComponent

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
            const entitiesToUpdate: Entity[] = [];

            const playerRoom = this.game.roomAt(this.game.playerRoomPos);

            // push all entities in the player's room with the required components
            entitiesToUpdate.push(...this.game.ecs.entitiesWithComponents(
                playerRoom,
                system.requiredComponents
            ));

            // as long as the system doesn't ignore AlwaysUpdateComponents, push
            // all entities with the required components and the AlwaysUpdateComponent
            // that could be in any room
            if (!system.ignoreAUC) entitiesToUpdate.push(...this.game.ecs.entities.filter(
                entity => shouldAlwaysUpdate(this.game.ecs, entity) &&
                    system.requiredComponents.every(
                        component => this.game.ecs.hasComponent(entity, component)
                    )
            ));

            // for each entity with the required components
            for (const entity of entitiesToUpdate) system.update(this.game, entity);
        }
    }
}

// generic type which creates a type for the contructor of a class
type Constructor<T> = new (...args: any[]) => T;

// container to hold all ECS related data and useful methods for accessing/manipulating them
export class ECS {
    #entities: Entity[] = []; // list of all entities including hidden ones
    componentManagers = new Map<Component, ComponentManager<any>>();
    systemManager: SystemManager;

    constructor(game: Game) {
        this.systemManager = new SystemManager(game);
    }

    // getter to return all entities that aren't hidden
    get entities(): Entity[] {
        return this.#entities.filter(entity => !isHidden(this, entity));
    }

    // add an entity with a unique ID
    createEntity(): Entity {
        let entityId = this.#entities.length;

        // find the next available entity ID if the current one is taken
        while (this.#entities.includes(entityId)) {
            entityId++;
        }

        // add the entity to the list of entities
        this.#entities.push(entityId);

        return entityId;
    }

    // remove an entity and all of its components
    removeEntity(entity: Entity): void {
        this.#entities.splice(this.#entities.indexOf(entity), 1);
        for (const componentManager of this.componentManagers.values()) {
            if (componentManager.components[entity]) {
                componentManager.removeComponent(entity);
            }
        }
    }

    // brings an entity to the end of the list of entities so it's rendered on top
    bringToFront(entity: Entity): void {
        this.#entities.splice(this.#entities.indexOf(entity), 1);
        this.#entities.push(entity);
    }

    // checks if an entity has a given component
    hasComponent(entity: Entity, component: Component): boolean {
        return this.componentManagers.get(component)?.getComponent(entity) !== undefined;
    }

    addComponent<T extends Constructor<Component>>(
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
        component: Constructor<T>
    ): T {
        return this.componentManagers
            .get(component)
            .getComponent(entity);
    }

    removeComponent(entity: Entity, component: Component): void {
        this.componentManagers
            .get(component)
            .removeComponent(entity);
    }

    // returns all entities in a certain room with the given components
    entitiesWithComponents(room: Room, components: Component[]): Entity[] {
        const entities: Entity[] = [];

        for (const entity of room.entities) {
            // assume the entity has all required components until proven otherwise
            let hasComponents = true;

            for (const component of components) { // for each component
                // if the entity doesn't have a required component it shouldn't be added to the list
                if (!this.hasComponent(entity, component)) {
                    hasComponents = false;

                    // no need to check for any more components if one is missing
                    break;
                }
            }

            if (hasComponents) entities.push(entity);
        }

        return entities;
    }
}