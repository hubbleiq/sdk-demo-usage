import { HubbleIQLib } from "hubbleiq-services";

// const options = {
// 	enablePageLoadCalculation: true,
// 	checkNetTimeOut: 2000
// };

const options = {
	enablePageLoadCalculation: false,
	env: 'local'
};
// construct the library
const hubbleIQLib = new HubbleIQLib (
	{
		apiKey: '288bab3e-7739-4cae-bcba-446d78bff304',
		companyKey: 'companyKeyTest',
	},
	options
);

hubbleIQLib.init();

export default hubbleIQLib;
