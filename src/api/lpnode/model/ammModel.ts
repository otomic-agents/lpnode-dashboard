// export interface InstallammParamsData {
//     imageRepository: string;
//     install: boolean;
// }

// export interface InstallammParams {
//     setupConfig: InstallammParamsData;
// }

// export interface InstallammModel {
//     code: number;
//     data: number;
//     message: string;
//     CmdStdout: string;
//     CmdStderr: string;
//     Template: string;
// }

// export interface InstallmarketParamsData {
//     imageRepository: string;
//     install: boolean;
// }

// export interface InstallmarketParams {
//     setupConfig: InstallmarketParamsData;
// }

// export interface InstallmarketModel {
//     code: number;
//     data: number;
//     message: string;
//     CmdStdout: string;
//     CmdStderr: string;
//     Template: string;
// }

// export interface UninstallmarketParamsData {
//     uninstall: boolean;
// }

// export interface UninstallmarketParams {
//     setupConfig: UninstallmarketParamsData;
// }

// export interface UninstallmarketModel {
//     code: number;
//     data: number;
//     message: string;
//     CmdStdout: string;
//     CmdStderr: string;
//     Template: string;
// }

export interface ENVItem {
    key: string;
    value: string;
}

export interface InstallammParamsData {
    name: string;
    imageRepository: string;
    install: boolean;
    containerPort: string;
    installType: string;
    customEnv: Array<ENVItem>;
}

export interface InstallammParams {
    setupConfig: InstallammParamsData;
}

export interface InstallammModel {
    CmdStdout: string;
    CmdStderr: string;
    Template: string;
}

export interface UninstallammParamsData {
    uninstall: boolean;
    installType: string;
    name: string;
}

export interface UninstallammParams {
    setupConfig: UninstallammParamsData;
}

export interface UninstallammModel {
    CmdStdout: string;
    CmdStderr: string;
    Template: string;
}

export interface ListResourceParams {

}

export interface AmmResource {

    id: string,
    templateResult: string,
    template: string,
    clientId: string,
    appName: string,
    version: string,
    versionHash: string
}

export type ListResourceModel = Array<AmmResource>

export type EditResourceParams = AmmResource

export interface EditResourceModel {
    
}