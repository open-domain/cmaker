import {
    AbstractExecuteCommandHandler,
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, ExecuteCommandAcceptor, inject,
    LangiumServices, LangiumSharedServices, Module, PartialLangiumServices
} from 'langium';
import { CmakerGeneratedModule, CmakerGeneratedSharedModule } from './generated/module';
import { CmakerValidator, registerValidationChecks } from './cmaker-validator';
import { generateCmakeFile } from '../cli/generator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type CmakerAddedServices = {
    validation: {
        CmakerValidator: CmakerValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type CmakerServices = LangiumServices & CmakerAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const CmakerModule: Module<CmakerServices, PartialLangiumServices & CmakerAddedServices> = {
    validation: {
        CmakerValidator: () => new CmakerValidator()
    }
};

var CurrentlyHighlightedFile : string | undefined;
export function set_currently_highlighted_file(file_path : string | undefined)
{
    CurrentlyHighlightedFile = file_path;
}

export function get_currently_highlighted_file()
{
    return CurrentlyHighlightedFile;
}

export class CmakerCommandHandler extends AbstractExecuteCommandHandler
{
    override registerCommands(acceptor: ExecuteCommandAcceptor): void {
        const generate_model_command = 'cmaker.generate';    
        acceptor(generate_model_command, () => {
                const activeEditor = CurrentlyHighlightedFile;
                return generateCmakeFile(activeEditor);
        });
    }
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createCmakerServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    Cmaker: CmakerServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        CmakerGeneratedSharedModule
    );
    const Cmaker = inject(
        createDefaultModule({ shared }),
        CmakerGeneratedModule,
        CmakerModule
    );
    shared.ServiceRegistry.register(Cmaker);
    registerValidationChecks(Cmaker);

    shared.lsp.ExecuteCommandHandler = new CmakerCommandHandler();

    return { shared, Cmaker };
}
