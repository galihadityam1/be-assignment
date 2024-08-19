// const supertokens = require("supertokens-node");
// const Session = require("supertokens-node/recipe/session");
// const EmailPassword = require("supertokens-node/recipe/emailpassword");
// const ThirdParty = require("supertokens-node/recipe/thirdparty");

// supertokens.init({
//   framework: "express",
//   supertokens: {
//     // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
//     connectionURI: "https://try.supertokens.com",
//     // apiKey: <API_KEY(if configured)>,
//   },
//   appInfo: {
//     // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
//     appName: "Take_Home_Assignment",
//     apiDomain: "http://localhost:3000",
//     websiteDomain: "http://localhost:3000",
//     apiBasePath: "/auth",
//     websiteBasePath: "/auth",
//   },
//   recipeList: [
//     // ThirdParty.init({
//     //     override: {
//     //         functions: (originalImplementation) => {
//     //             return {
//     //                 ...originalImplementation,

//     //                 // override the thirdparty sign in / up function
//     //                 signInUp: async function (input) {
//     //                     // TODO: Some pre sign in / up logic
//     //                     console.log("masuk sign");

//     //                     let response = await originalImplementation.signInUp(input);

//     //                     if (response.status === "OK") {

//     //                         let accessToken = response.oAuthTokens["access_token"];

//     //                         let firstName = response.rawUserInfoFromProvider.fromUserInfoAPI;

//     //                         if (input.session === undefined) {
//     //                             if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
//     //                                 // TODO: some post sign up logic
//     //                             } else {
//     //                                 // TODO: some post sign in logic
//     //                             }
//     //                         }
//     //                     }

//     //                     return response;
//     //                 }
//     //             }
//     //         }
//     //     }
//     // }),
//     EmailPassword.init({
//         override: {
//             functions: (originalImplementation) => {
//                 console.log('masuk');
//                 return {
//                     ...originalImplementation,

//                     // override the email password sign up function
//                     signUp: async function (input) {
//                         // TODO: some pre sign up logic
//                         console.log("masuk sign up");

//                         let response = await originalImplementation.signUp(input);

//                         if (response.status === "OK" && response.user.loginMethods.length === 1 && input.session === undefined) {
//                             // TODO: some post sign up logic
//                         }

//                         return response;
//                     },

//                     // override the email password sign in function
//                     signIn: async function (input) {
//                         // TODO: some pre sign in logic
//                         console.log("masuk sign in");

//                         let response = await originalImplementation.signIn(input);

//                         if (response.status === "OK" && input.session === undefined) {
//                             // TODO: some post sign in logic
//                         }

//                         return response;
//                     },
//                 }
//             }
//         }
//     }),
//     Session.init({ /* ... */ })
// ]
// });

// module.exports = { supertokens };
