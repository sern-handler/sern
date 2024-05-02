import type { ClientEvents } from 'discord.js';
import { EventType } from '../core/structures/enums';
import type { AnyEventPlugin, } from '../types/core-plugin';
import type {
    InputCommand,
    InputEvent,
} from '../types/core-modules';
import { type _Module, partitionPlugins } from './_internal';
import type { Awaitable } from '../types/utility';
import callsites from 'callsites';
import * as Files from './module-loading'
import * as Id from './id'

/**
 * @since 1.0.0 The wrapper function to define command modules for sern
 * @param mod
 */
export function commandModule(mod: InputCommand): _Module {
    const [onEvent, plugins] = partitionPlugins(mod.plugins);
    const initCallsite = callsites()[1].getFileName();
    if(!initCallsite) throw Error("initCallsite is null");

    const { name, absPath } = Files.parseCallsite(initCallsite);
    mod.name ??= name;
    mod.description ??= '...'
    //@ts-ignore
    return {
        ...mod,
        meta: {
            id: Id.create(mod.name, mod.type),
            absPath
        },
        onEvent,
        plugins,
    };
}
/**
 * @since 1.0.0
 * The wrapper function to define event modules for sern
 * @param mod
 */
export function eventModule(mod: InputEvent): _Module {
    const [onEvent, plugins] = partitionPlugins(mod.plugins);
    const initCallsite = callsites()[1].getFileName();
    if(!initCallsite) throw Error("initCallsite is null");
    const { name, absPath } = Files.parseCallsite(initCallsite);
    mod.name ??= name;
    mod.description ??= '...'
    //@ts-ignore
    return {
        ...mod,
        meta: {
            id: Id.create(mod.name, mod.type),
            absPath
        },
        plugins,
        onEvent,
    };
}

/** Create event modules from discord.js client events,
 * This is an {@link eventModule} for discord events,
 * where typings can be very bad.
 * @Experimental
 * @param mod
 */
export function discordEvent<T extends keyof ClientEvents>(mod: {
    name: T;
    plugins?: AnyEventPlugin[];
    execute: (...args: ClientEvents[T]) => Awaitable<unknown>;
}) {
    return eventModule({ type: EventType.Discord, ...mod, });
}

