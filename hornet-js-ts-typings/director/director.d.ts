///<reference path='../express/express.d.ts'/>

declare module "director" {
    import express = require('express');

    module d {
        export class DirectorRouter {
            constructor(routes?:any);
            dispatch(event:string, url:string):void;
            setRoute(route:string):void;
            configure(configuration:DirectorRouterConfiguration):DirectorRouter;
            init():void;
            attach(nextFn:()=>void):void;
            dispatch(req:Express.Request, res:Express.Response, errorFn:(arr:any)=>void):void;
            mount(routes:any, path?:string):void;
        }

        export class Http {
            static Router:typeof DirectorRouter;
        }

        interface DirectorRequest extends express.Request {
            body:any;
            query:any;
            headers: { [key: string]: string; };
        }

        interface DirectorResponse extends express.Response {
            render:(template:string, params:{}) => void;
            status:(status:number) => DirectorResponse;
            writeHead:(status:number, headers:{}) => void;

            locals:ExpressLocal;
        }

        interface ExpressLocal {
            state: any;
        }

        interface DirectorRouterConfiguration {
            recurse?:boolean;
            html5history?:boolean;
            strict?: boolean;
            convert_hash_in_init?: boolean;
            'notfound'?: Function;
            /* patch hornet */
            async?: boolean;
        }
    }

    class d {
        static Router:typeof d.DirectorRouter;
        static http:typeof d.Http;
    }
    export = d;
}