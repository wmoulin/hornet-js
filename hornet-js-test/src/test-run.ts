/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-test - Ensemble des composants pour les tests hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

////////////////////////////////////////////////////////////////////////////////////////////////////

import { Annotations as annotes } from "hornet-js-test/src/decorators";

var Logger = require("hornet-js-utils/src/logger");
import { TestLogger } from "hornet-js-test/src/test-logger";

Logger.Logger.prototype.buildLogger = TestLogger.getLoggerBuilder({
    "levels": {
        "[all]": "INFO"
    },
    "appenders": [
        {
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "%[%d{ISO8601}|%p|%c|%m%]"
            }
        }
    ]
});

import { Utils } from "hornet-js-utils";

Utils.getLogger = Logger.Logger.getLogger;

if (typeof window !== "undefined"){
    window.addEventListener("unhandledrejection", function (e) {

        // NOTE: e.preventDefault() must be manually called to prevent the default
        // action which is currently to log the stack trace to console.warn
        e.preventDefault();
        // NOTE: parameters are properties of the event detail property
        let reason = (e[ "detail" ] && e[ "detail" ].reason) || e[ "reason" ];
        // See Promise.onPossiblyUnhandledRejection for parameter documentation
        console.error("unhandledrejection ", reason);
        //TODO faire un throw reason uniquement en env development
        throw reason;
    });

    // NOTE: event name is all lower case as per DOM convention
    window.addEventListener("rejectionhandled", function (e) {
        // NOTE: e.preventDefault() must be manually called prevent the default
        // action which is currently unset (but might be set to something in the future)
        e.preventDefault();
        // NOTE: parameters are properties of the event detail property
        var promise = e[ "detail" ].promise;
        // See Promise.onUnhandledRejectionHandled for parameter documentation
        console.error("rejectionHandled error for promise ", promise);
    });


} else {
    if (typeof process !== "undefined") {
        // NOTE: event name is camelCase as per node convention
        process.on("unhandledRejection", function (reason, promise) {
            // See Promise.onPossiblyUnhandledRejection for parameter documentation
            console.error("unhandledRejection : ", reason);
            throw reason;
        });

        // NOTE: event name is camelCase as per node convention
        process.on("rejectionHandled", function (promise) {
            // See Promise.onUnhandledRejectionHandled for parameter documentation
            console.error("rejectionHandled for promise ", promise);
            throw new Error("rejectionHandled for promise");
        });
    }
}

/**
 * lanceur des tests
 * @param suite
 */
export function runTest(suite) {
    let proto = Object.getPrototypeOf(suite);
    let suiteName = proto.constructor.suiteName;
    let annotations = getAnnotatedValues(proto);

    let {beforeFunc, beforeEachFunc, afterFunc, testName, testAsyncName, testThrowAsyncName, testXit} = annotations;

    describe(suiteName, () => {
        before(function () {
            if (typeof document !== "undefined") {
                let lista = document.body.childNodes;
                for (let i = lista.length - 1; i >= 0; i--) {
                    if (lista[ i ][ "tagName" ] != 'SCRIPT') document.body.removeChild(lista[ i ]);
                }
            }
        });

        beforeFunc.forEach(beforeHook => before(beforeHook.bind(suite)));
        beforeEachFunc.forEach(beforeEachHook => beforeEach(beforeEachHook.bind(suite)));
        afterFunc.forEach(afterHook => after(afterHook.bind(suite)));
        testXit.forEach((test) => {
            function fntTest(done) {
                this.test.pending = true;
                done();
            }

            it(test.testXit, fntTest)
        });
        let count = 0;
        testName.forEach((test) => {
            let name = test.testName[ 0 ];
            let fnt = (done) => {
                let _done = done;
                suite.catchAsyncThrow(_done);
                if (typeof window !== "undefined"){
                    document.body.setAttribute("style", "padding:10px");
                    let fntError: ErrorEventHandler = window.onerror;
                    window.onerror = (errMsg, url, line, lline, err) => {
                        window.onerror = fntError;
                        gestureErr(test, _done, err)
                    };
                    count++;
                    let h2 = document.createElement("h2");
                    h2.innerHTML = "<u>Test " + count + " :</u> " + name;
                    document.body.appendChild(h2);
                    let hr = document.createElement("hr");
                    hr.style.height = "2px";
                    hr.style.backgroundColor = "#007ecb";
                    hr.style.marginTop = "0px";
                    hr.style.marginBottom = "5px";
                    document.body.appendChild(hr);
                }
                suite[ 'endft' ] = done;
                try {
                    test.apply(suite, [ _done ]);
                } catch (err) {
                    gestureErr(test, _done, err)
                }
            }
            it(test.testName[ 0 ], fnt.bind(suite))
        });
    });
}

/**
 * gestureErr fonction qui permet de gèrer les erreurs lors d'un test
 * @param suite
 * @returns {any}
 */
function gestureErr(test, done, err) {
    let fnt = false;
    if (test.testName[ 1 ]) {
        let isErrorType = false;
        try {
            let instance = new test.testName[ 1 ];
            if (instance instanceof Error) {
                isErrorType = true;
            }
        } catch (e) {
            //ignore
        }
        if (isErrorType) {
            fnt = err instanceof test.testName[ 1 ];
        } else {
            fnt = test.testName[ 1 ].apply(test, [ err ]);
        }
    }
    if (fnt) {
        done();
    } else {
        done(new Error(err));
    }
}

/**
 * getAnnotatedValues
 * @param suite
 * @returns {any}
 */
function getAnnotatedValues(suite: any): any {
    let props = getInheritedProps(suite);
    let suiteData = getEmptyAnnotations();

    props.forEach(prop => {
        let method = suite[ prop ];
        if (!(method instanceof Function)) return;

        let methodProps = Object.keys(method);
        methodProps.forEach(prop => {
            let hasAnnote = getAnnotationsValues().includes(prop);
            if (hasAnnote) {
                suiteData[ prop ].push(method);
            }
        });
    });

    return suiteData;
}

/**
 * getInheritedProps
 * @param obj
 * @param props
 * @returns {any}
 */
function getInheritedProps(obj: any, props: Array<any> = []): any {
    if (!obj) return props;

    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (!props[ prop ]) {
            props.push(prop);
        }
    });
    return getInheritedProps(Object.getPrototypeOf(obj), props);
}

/**
 * clean
 */
function getEmptyAnnotations(): any {
    return getAnnotationsValues().reduce((collection, annotationType) => {
        collection[ annotationType ] = [];
        return collection;
    }, {});
}

/**
 * clone la conf Annotations from decorators.ts
 * @returns {any[]}
 */
function getAnnotationsValues(): any {
    let annotations = Object.keys(annotes).map(key => annotes[ key ]);
    return annotations;
}