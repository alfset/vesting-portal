import { Registry } from '@polkadot/types/types';
import { ModuleTypes, TypeImports } from './imports';
/** @internal */
export declare function getDerivedTypes(definitions: Record<string, ModuleTypes>, type: string, primitiveName: string, imports: TypeImports): string[];
/** @internal */
export declare function getSimilarTypes(definitions: Record<string, ModuleTypes>, registry: Registry, _type: string, imports: TypeImports): string[];
