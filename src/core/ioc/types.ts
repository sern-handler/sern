import { EventEmitter } from 'node:events';
import { Container, UnpackFunction } from 'iti';
import { AnyFunction } from '../../shared-types';

export type Singleton<T> = () => T;
export type Transient<T> = () => () => T;

interface EmitterAdapter {
    [eventName: string] : AnyFunction

    removeListener (): this
    addListener () : this
}


export interface CoreDependencies {
    '@sern/client': () => EventEmitter
    '@sern/logger'?: () => import('../contracts').Logging;
    '@sern/emitter': () => import('../structures/sern-emitter').SernEmitter;
    '@sern/store': () => import('../contracts').CoreModuleStore;
    '@sern/modules': () => import('../contracts').ModuleManager;
    '@sern/errors': () => import('../contracts').ErrorHandling;
}

export type DependencyFromKey<T extends keyof Dependencies> = Dependencies[T];

export type IntoDependencies<Tuple extends [...any[]]> = {
    [Index in keyof Tuple]: UnpackFunction<NonNullable<DependencyFromKey<Tuple[Index]>>>; //Unpack and make NonNullable
} & { length: Tuple['length'] };

export interface DependencyConfiguration {
    //@deprecated. Loggers will always be included in the future
    exclude?: Set<'@sern/logger'>;
    build: (root: Container<Omit<CoreDependencies, '@sern/client'>, {}>) => Container<Dependencies, {}>;
}

