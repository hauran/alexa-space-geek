/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var FACTS = [
    "A year on Mercury is just 88 days long.",
    "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
    "Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.",
    "On Mars, the Sun appears about half the size as it does on Earth.",
    "Earth is the only planet not named after a god.",
    "Jupiter has the shortest day of all the planets.",
    "The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.",
    "The Sun contains 99.86% of the mass in the Solar System.",
    "The Sun is an almost perfect sphere.",
    "A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.",
    "Saturn radiates two and a half times more energy into space than it receives from the sun.",
    "The temperature inside the Sun can reach 15 million degrees Celsius.",
    "The Moon is moving approximately 3.8 cm away from our planet every year."
];

const PLANETS = ['Mercury',
  'Venus',
  'Mars',
  'Earth',
  'Saturn'
]

const PLANET_JOKES = {
  'mercury':[0,1],
  'venus':[1,2],
  'mars':[3],
  'earth':[3,4],
  'saturn':[10]
}

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fact.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "SupportedPlanetsIntent": function (intent, session, response) {
        handleSupportedPlanetsRequest(response);
    },

    "OneShotFactAboutPlanet": (intent, session, response) => {
        handleOneShotFactAboutPlanet(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a space fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// function handleNoSlotDialogRequest (intent, session, response)  {
//     if (!session.attributes.planet) {
//         // get date re-prompt
//         var repromptText = "Which planet would you like to hear a Fact about?";
//         var speechOutput = repromptText;
//
//         response.ask(speechOutput, repromptText);
//     } else {
//       var speechOutput = "Why am I hear?";
//       var cardTitle = "You fucked up";
//       response.tellWithCard(speechOutput, cardTitle, speechOutput);
//     }
// }



function handleOneShotFactAboutPlanet (intent, session, response) {
  var planet = intent.slots.Planet;

  // var speechOutput = "Your user ID is: " + session.user.userId + ".  ";
  var speechOutput = "Here is your fact about " + planet.value + ".  ";
  speechOutput += FACTS[PLANET_JOKES[planet.value.toLowerCase()][0]];

  var cardTitle = "Your fact about " + planet.value;
  response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

//
// function getPlanetFromIntent(intent, assignDefault) {
//     var planetSlot = intent.slots.Planet;
//     // slots can be missing, or slots can be provided but with empty value.
//     // must test for both.
//     if (!planetSlot || !planetSlot.value) {
//         if (!assignDefault) {
//             return {
//                 error: true
//             }
//         } else {
//             // For sample skill, default to Seattle.
//             return {
//                 planet: 'Earth'
//             }
//         }
//     } else {
//         // lookup the city. Sample skill uses well known mapping of a few known cities to station id.
//         var planetName = planetSlot.value;
//         if (planetName) {
//             return {
//                 planet: planetName
//             }
//         } else {
//             return {
//                 error: true,
//                 planet: planetName
//             }
//         }
//     }
// }


/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * FACTS.length);
    var randomFact = FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your fact: " + randomFact;
    var cardTitle = "Your Fact";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}


function handleSupportedPlanetsRequest(response) {
    // Create speech output
    var speechOutput = "I know facts about the planets " + PLANETS.join(', ');
    var cardTitle = "The Planets";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};
