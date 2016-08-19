﻿///<reference path="../typedefs/WebDriverIO.d.ts"/>
//import * as references from "../_references";

export module WebDriverIOHelper {
    (function init() {
        let clients: WebdriverIO.Client<void>[] = [];

        (<any>global).WebdriverIO = require('webdriverio');
        let remote = WebdriverIO.remote;

        (<any>WebdriverIO).remote = function() {
            let client = remote.apply(this, arguments);
            clients.push(client);
            return client;
        };

        let runner = jasmine.getEnv().currentRunner();
        let finishCallback = runner.finishCallback;

        runner.finishCallback = function() {
            let finishCallbackArgs = arguments;
            Q.allSettled(clients.map(c =>  c.endAll())).then(() => {
                    if(finishCallback) {
                        finishCallback.apply(this, finishCallbackArgs);
                    }
                });
        };
    })();

    export enum Browser {
        chrome = <any>"chrome"
    }

    export function getWebClient(browser: Browser): WebdriverIO.Client<void> {
        let client = WebdriverIO.remote({ desiredCapabilities: { browserName: browser }, waitforTimeout: 30000 });
        return client;
    }
}


