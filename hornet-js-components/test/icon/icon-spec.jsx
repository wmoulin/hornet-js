"use strict";

var React = require('react');

var	TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

// initialisation du logger
var logger = TestUtils.getLogger("hornet-js-components.test.icon.icon-spec");

var Icon = require('src/icon/icon');

describe('Icon', () => {

	// Arrange
	var props = {url:'/partenaires',  alt: 'test alt image', title: 'test', src: '#', classLink: 'classLien'};

	var context ={
		getStore: (store) => {
			return {
				getThemeUrl : function() {
					return "utltheme";
				}
			};
		},
		executeAction: () => {
		},
		locale: "fr-FR",
		i18n: function (keysString) {
			return keysString;
		}
	};

	// Act
	var $ = render(() =>
		<div>
			<Icon url={props.url} alt={props.alt} title={props.title} src={props.src}/>
		</div>,
		context
	);

	it('doit afficher un icône avec les éléments requis', () => {
		// Assert
		var $a = $('a');
		expect($a).to.exist;
		expect($a).to.have.attr('title');
		expect($a).to.have.attr('href');


		var $img = $('img');
		expect($img).to.exist;
		expect($img).to.have.attr('alt');
		expect($img).to.have.attr('src');
	});

});