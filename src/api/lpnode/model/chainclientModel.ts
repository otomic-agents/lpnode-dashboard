export interface InstallParamsData {
    imageRepository: string;
    type: string;
    startBlock: string;
    rpcUrl: string;
    connectionNodeurl: string;
    connectionWalleturl: string;
    connectionHelperurl: string;
    connectionExplorerurl: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    install: boolean;
}

export interface InstallParams {
    setupConfig: InstallParamsData;
}

export interface InstallModel {
    code: number;
    data: number;
    message: string;
    Template: string;
}

export interface UninstallParamsData {
    type: string;
    uninstall: boolean;
}
export interface UninstallParams {
    setupConfig: UninstallParamsData;
}

export interface UninstallModel {
    code: number;
    data: number;
    message: string;
    CmdStdout: string;
    CmdStderr: string;
}