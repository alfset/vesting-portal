import { TypeDef } from '@polkadot/types/create/types';
import { ModuleTypes, TypeImports } from './imports';
export declare const HEADER: (type: 'chain' | 'defs') => string;
/** @internal */
export declare function exportInterface(name: string | undefined, base: string, body?: string): string;
/** @internal */
export declare function exportType(name: string | undefined, base: string): string;
/**
 * Correctly format a given type
 */
/** @internal */
export declare function formatType(definitions: Record<string, ModuleTypes>, type: string | TypeDef, imports: TypeImports): string;
