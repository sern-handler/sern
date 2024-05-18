/*
 * Plugins can be inserted on all commands and are emitted
 *
 * 1. On ready event, where all commands are loaded.
 * 2. On corresponding observable (when command triggers)
 *
 * The goal of plugins is to organize commands and
 * provide extensions to repetitive patterns
 * examples include refreshing modules,
 * categorizing commands, cool-downs, permissions, etc.
 * Plugins are reminiscent of middleware in express.
 */

import type { Err, Ok, Result } from 'ts-results-es';
import type {
    BothCommand,
    ButtonCommand,
    ChannelSelectCommand,
    CommandModule,
    ContextMenuMsg,
    ContextMenuUser,
    DiscordEventCommand,
    EventModule,
    ExternalEventCommand,
    MentionableSelectCommand,
    ModalSubmitCommand,
    Module,
    Processed,
    RoleSelectCommand,
    SernEventCommand,
    SlashCommand,
    StringSelectCommand,
    TextCommand,
    UserSelectCommand,
} from './core-modules';
import type { Args, Awaitable, Payload, SlashOptions } from './utility';
import type { CommandType, EventType, PluginType } from '../core/structures/enums'
import type { Context } from '../core/structures/context'
import type {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ClientEvents,
    MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction,
} from 'discord.js';

export type PluginResult = Awaitable<Result<unknown, unknown>>;

export interface InitArgs<T extends Processed<Module>> {
    module: T;
    absPath: string;
    updateModule: (module: Partial<T>) => T
}
export interface Controller {
    next: () => Ok<void>;
    stop: () => Err<void>;
}
export interface Plugin<Args extends any[] = any[]> {
    type: PluginType;
    execute: (...args: Args) => PluginResult;
}

export interface InitPlugin<Args extends any[] = any[]> {
    type: PluginType.Init;
    execute: (...args: Args) => PluginResult;
}
export interface ControlPlugin<Args extends any[] = any[]> {
    type: PluginType.Control;
    execute: (...args: Args) => PluginResult;
}

export type AnyCommandPlugin = ControlPlugin | InitPlugin<[InitArgs<Processed<Module>>]>;
export type AnyEventPlugin = ControlPlugin | InitPlugin<[InitArgs<Processed<Module>>]>;

export type CommandArgs<
    I extends CommandType = CommandType,
    J extends PluginType = PluginType,
> = CommandArgsMatrix[I][J];

export type EventArgs< I extends EventType = EventType,
    J extends PluginType = PluginType,
> = EventArgsMatrix[I][J];

interface CommandArgsMatrix {
    [CommandType.Text]: {
        [PluginType.Control]: [Context, ['text', string[]]];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.Slash]: {
        [PluginType.Control]: [Context, ['slash', /* library coupled */ SlashOptions]];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.Both]: {
        [PluginType.Control]: [Context, Args];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.CtxMsg]: {
        [PluginType.Control]: [/* library coupled */ MessageContextMenuCommandInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.CtxUser]: {
        [PluginType.Control]: [/* library coupled */ UserContextMenuCommandInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.Button]: {
        [PluginType.Control]: [/* library coupled */ ButtonInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.StringSelect]: {
        [PluginType.Control]: [/* library coupled */ StringSelectMenuInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.RoleSelect]: {
        [PluginType.Control]: [/* library coupled */ RoleSelectMenuInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.ChannelSelect]: {
        [PluginType.Control]: [/* library coupled */ ChannelSelectMenuInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.MentionableSelect]: {
        [PluginType.Control]: [/* library coupled */ MentionableSelectMenuInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.UserSelect]: {
        [PluginType.Control]: [/* library coupled */ UserSelectMenuInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
    [CommandType.Modal]: {
        [PluginType.Control]: [/* library coupled */ ModalSubmitInteraction];
        [PluginType.Init]: [InitArgs<Processed<Module>>];
    };
}

interface EventArgsMatrix {
    [EventType.Discord]: {
        [PluginType.Control]: /* library coupled */ ClientEvents[keyof ClientEvents];
        [PluginType.Init]: [InitArgs<Processed<DiscordEventCommand>>];
    };
    [EventType.Sern]: {
        [PluginType.Control]: [Payload];
        [PluginType.Init]: [InitArgs<Processed<SernEventCommand>>];
    };
    [EventType.External]: {
        [PluginType.Control]: unknown[];
        [PluginType.Init]: [InitArgs<Processed<ExternalEventCommand>>];
    };
    [EventType.Cron]: {
        [PluginType.Control]: unknown[];
        [PluginType.Init]: [InitArgs<Processed<ExternalEventCommand>>];
    };
}
