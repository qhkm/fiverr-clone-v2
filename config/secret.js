module.exports = {
	database:
		process.env.DATABASE ||
		'mongodb://admin:test1234@ds125211.mlab.com:25211/fiverrclone',
	port: process.env.PORT || 3000,
	secret: process.env.SECRET || 'fiverclone2222',
	algolia_appId: 'B208GQV2JF',
	algolia_api_key: '87e7bfdc40585448ef12d7b3acfb99a6'
}
