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
 * hornet-js-bean - Ensemble des décorateurs pour les beans hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */



import { TestUtils } from "hornet-js-test/src/test-utils";
import {User} from "./model/user";
import {Adress} from "./model/adress";
import {UserDTO} from "./model/userDTO";

var expect:any = TestUtils.chai.expect;
import * as _ from "lodash";
import {TechnicalError} from "hornet-js-utils/src/exception/technical-error";
import {AdressDTO} from "test/model/adressDTO";
import {OtherUser} from "test/model/OtherUser";
import {BeanUtils} from "src/bean-utils";
import {ForeignUser, ForeignAdress} from "./model/ForeignUser";


let user : User;
let user2 : User;
describe("Test of BeanUtils.serialize* : ", () => {

    beforeEach(() => {
        user = new User('1', '2');
        user.list = [];
        user.list.push(new Adress("my adress1"));
        user.list.push(new Adress("my adress2"));
        user.list[0].id = 12;
        user.list[1].id = 13;
        user.adress = new Adress("Object = my adress1");
        user.id = 10;


        user2 = new User('3', '4');
        user2.list = [];
        user2.list.push(new Adress("my adress1"));
        user2.list.push(new Adress("my adress2"));
        user2.list[0].id = 14;
        user2.list[1].id = 15;
        user2.adress = new Adress("Object = my adress1");
        user2.id = 12;
    });

    it("should create a array of User", (done) => {
        let array = [user, user2];
        BeanUtils.serializeObject(User, array).then((result)=> {
            expect(result).not.empty;
            expect(result.length).to.be.eq(array.length);
            _.map(result, function (item) {
                expect(item).to.be.an.instanceOf(User)
            });
            for (var i = 0; i < result.length; i++) {
                expect(result[i].id).to.be.undefined;
                expect(array[i].id).to.be.exist;
                expect(result[i].name).to.be.eq(array[i].name);
                expect(result[i].password).to.be.eq(array[i].password);
                expect(result[i].adress.label).to.be.eq(array[i].adress.label);

                expect(result[i].list.length).to.be.eq(array[i].list.length);
                for (var j = 0; j < result[i].list.length; j++) {
                    expect(result[i].list[j].id).to.be.undefined;
                    expect(array[i].list[j].id).to.be.exist;
                    expect(result[i].list[j].label).to.be.eq(array[i].list[j].label);
                }
            }
            done();
        }).catch((error)=> {
            done(error);
        });
    });


    it("should test object is null ", (done) => {
        BeanUtils.serializeObject(User, null).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test object is undefined ", (done) => {
        BeanUtils.serializeObject(User, undefined).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it.skip("should test object is primitive ", (done) => {
        BeanUtils.serializeObject(User, 2).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error) => {
            expect(error).to.be.instanceOf(TechnicalError);
            expect(error.args.message).to.be.equals('Cannot find @Bean for object : 2 .So, we cannot transform it to an object User');
            done()
        });
    });

    it("should test class is null ", (done) => {
        BeanUtils.serializeArray(null, [user, user2]).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test class is boolean ", (done) => {
        BeanUtils.serializeArray(false, [user, user2]).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test object like function ", (done) => {
        BeanUtils.serializeObject(User, function () {
        }).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test empty array with mapArray", (done) => {
        BeanUtils.serializeArray(User, []).then((result)=> {
            expect(result).isArray;
            expect(result).to.be.empty;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test empty array with serializeObject ", (done) => {
        BeanUtils.serializeObject(User, []).then((result)=> {
            expect(result).isArray;
            expect(result).to.be.empty;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test class User", (done) => {
        BeanUtils.serializeObject(User, user).then((result)=> {
            expect(result).to.be.instanceof(User);
            expect(result.id).to.be.undefined;
            expect(result.name).to.be.eql(user.name);
            expect(result.adress.label).to.be.eql(user.adress.label);
            expect(result.adress.id).to.be.undefined;
            expect(result.list.length).to.be.eq(user.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(Adress);
                expect(result.list[j].id).to.be.undefined;
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(user.list[j].label);
            }
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it("should test class UserDTO ", (done) => {
        BeanUtils.serializeObject(UserDTO, user).then((result)=> {
            expect(result).to.be.instanceof(UserDTO);
            expect(result.id).to.be.undefined;
            expect(result.name).to.be.eql(user.name);
            expect(result.adress.label).to.be.eql(user.adress.label);
            expect(result.adress.id).to.be.undefined;
            expect(result.list.length).to.be.eq(user.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(AdressDTO);
                expect(result.list[j].id).to.be.undefined;
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(user.list[j].label);
            }
            done();
        }).catch((error)=> {
            done(error);
        });
    });
});


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

describe("Test of BeanUtils.map* : ", () => {

        beforeEach(() => {
            user = new User('1', '2');
            user.list = [];
            user.list.push(new Adress("my adress1"));
            user.list.push(new Adress("my adress2"));
            user.list[0].id=12;
            user.list[1].id=13;
            user.adress = new Adress("Object = my adress1");
            user.id=10;


            user2 = new User('3', '4');
            user2.list = [];
            user2.list.push(new Adress("my adress1"));
            user2.list.push(new Adress("my adress2"));
            user2.list[0].id=14;
            user2.list[1].id=15;
            user2.adress = new Adress("Object = my adress1");
            user2.id=12;
        });


    it("should create a array of User", (done) => {
        let array = [user, user2];
        BeanUtils.mapObject(User, array).then((result)=> {
            expect(result).not.empty;
            expect(result.length).to.be.eq(array.length);
            _.map(result, function(item){
                expect(item).to.be.an.instanceOf(User)
            });
            for (var i = 0; i < result.length; i++) {
                expect(result[i].id).to.be.eq(0);;
                expect(array[i].id).to.be.exist;
                expect(result[i].name).to.be.eq(array[i].name);
                expect(result[i].password).to.be.eq(array[i].password);
                expect(result[i].adress.label).to.be.eq(array[i].adress.label);
                expect(result[i].adress.id).to.be.eq(0);
                expect(result[i].list.length).to.be.eq(array[i].list.length);
                for (var j = 0; j < result[i].list.length; j++) {
                    expect(result[i].list[j].id).to.be.eq(0);
                    expect(array[i].list[j].id).to.be.exist;
                    expect(result[i].list[j].label).to.be.eq(array[i].list[j].label);
                }
            }
            done();
        }).catch((error)=>{
            done(error);
        });
    });


    it("should test object is null ", (done) => {
        BeanUtils.mapObject(User, null).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test object is undefined ", (done) => {
        BeanUtils.mapObject(User, undefined).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it.skip("should test object is primitive ", (done) => {
        BeanUtils.mapObject(User, 2).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error) => {
            expect(error).to.be.instanceOf(TechnicalError);
            expect(error.args.message).to.be.equals('Cannot find @Bean for object : 2 .So, we cannot transform it to an object User');
            done()
        });
    });

    it("should test class is null ", (done) => {
        BeanUtils.mapArray(null, [user, user2]).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test class is boolean ", (done) => {
        BeanUtils.mapArray(false, [user, user2]).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test mapArray is boolean ", (done) => {
        BeanUtils.mapArray(false, [user, user2]).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test object like function ", (done) => {
        BeanUtils.mapObject(User, function () {}).then((result)=> {
            expect(result).to.be.undefined;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test empty array with mapArray", (done) => {
        BeanUtils.mapArray(User, []).then((result)=> {
            expect(result).isArray;
            expect(result).to.be.empty;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test empty array with mapObject ", (done) => {
        BeanUtils.mapObject(User, []).then((result)=> {
            expect(result).isArray;
            expect(result).to.be.empty;
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test class User", (done) => {
        BeanUtils.mapObject(User, user).then((result)=> {
            expect(result).to.be.instanceof(User);
            expect(result.id).to.be.eq(0);
            expect(result.name).to.be.eql(user.name);
            expect(result.adress.label).to.be.eql(user.adress.label);
            expect(result.adress.id).to.be.eq(0);
            expect(result.list.length).to.be.eq(user.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(Adress);
                expect(result.list[j].id).to.be.eq(0);
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(user.list[j].label);
            }
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test class UserDTO ", (done) => {
        BeanUtils.mapObject(UserDTO, user).then((result)=> {
            expect(result).to.be.instanceof(UserDTO);
            expect(result.id).to.be.eq(0);
            expect(result.name).to.be.eql(user.name);
            expect(result.adress.label).to.be.eql(user.adress.label);
            expect(result.adress.id).to.be.eq(0);
            expect(result.list.length).to.be.eq(user.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(AdressDTO);
                expect(result.list[j].id).to.be.eq(0);
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(user.list[j].label);
            }
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test class OtherUser (empty constructor) ", (done) => {
        BeanUtils.mapObject(OtherUser, user).then((result)=> {
            expect(result).to.be.instanceof(OtherUser);
            expect(result.id).to.be.eq(0);
            expect(result.name).to.be.eql(user.name);
            expect(result.adress.label).to.be.eql(user.adress.label);
            expect(result.adress.id).to.be.eq(0);
            expect(result.list.length).to.be.eq(user.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(Adress);
                expect(result.list[j].id).to.be.eq(0);
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(user.list[j].label);
            }
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test class ForeignUser (with no @Bean) ", (done) => {
        let foreignUser = new ForeignUser();
        foreignUser.name = 'foreignUser';
        foreignUser.list = [];
        let ad1 = new ForeignAdress();
        ad1.id = "ad1";
        ad1.label = "foreign ad1";
        ad1.comment = "foreign comment ad1";
        let ad2 = new ForeignAdress();
        ad1.id = "ad2";
        ad2.label = "foreign ad2";
        ad2.comment = "foreign comment ad2";
        foreignUser.list.push(ad1);
        foreignUser.list.push(ad2);
        let ad3 = new ForeignAdress();
        ad3.id = "ad3";
        ad3.label = "foreign ad3";
        ad3.comment = "foreign comment ad3";

        foreignUser.adress = ad3;
        foreignUser.comments = "foreign comment foreignUser";

        BeanUtils.mapObject(UserDTO, foreignUser).then((result)=> {
            expect(result).to.be.instanceof(UserDTO);
            expect(result.id).to.be.eq(0);
            expect(result.name).to.be.eql(foreignUser.name);
            expect(result.adress.label).to.be.eql(foreignUser.adress.label);
            expect(result.adress.id).to.be.eq(0);
            expect(result.list.length).to.be.eq(foreignUser.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(AdressDTO);
                expect(result.list[j].id).to.be.eq(0);
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(foreignUser.list[j].label);
            }
            done();
        }).catch((error)=>{
            done(error);
        });
    });

    it("should test class User with an attribute Number", (done) => {
        user.number = new Number(2)
        BeanUtils.mapObject(User, user).then((result)=> {
            expect(result).to.be.instanceof(User);
            expect(result.id).to.be.eq(0);
            expect(result.name).to.be.eql(user.name);
            expect(result.adress.label).to.be.eql(user.adress.label);
            expect(result.adress.id).to.be.eq(0);
            expect(result.number).to.be.instanceOf(Number);
            expect(result.number.valueOf()).to.be.eq(user.number.valueOf());
            expect(result.list.length).to.be.eq(user.list.length);
            for (var j = 0; j < result.list.length; j++) {
                expect(result.list[j]).to.be.instanceOf(Adress);
                expect(result.list[j].id).to.be.eq(0);
                expect(user.list[j].id).to.be.exist;
                expect(result.list[j].label).to.be.eq(user.list[j].label);
            }
            done();
        }).catch((error)=>{
            done(error);
        });
    });
});
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
describe("Test of BeanUtils.clone* : ", () => {
    it.skip("should do a dummy deep equal test", () => {
        let array = [user, user2];
        let array2 = _.cloneDeep(array);
        expect(array).to.deep.eql(array2);
    });

    it("should do a cloneArray deep equal test", (done) => {
        let array = [user, user2];
        BeanUtils.cloneArray(array, {deep: true}).then((result)=> {
            expect(result).to.deep.eql(array);
            done()
        }).catch((error)=>{
            done(error);
        });
    });

    it("should do a cloneArray deep equal test", (done) => {
        let array = [user, user2];
        BeanUtils.cloneArray(array).then((result)=> {
            expect(result).to.eql(array);
            done()
        }).catch((error)=>{
            done(error);
        });
    });
});

