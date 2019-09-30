/* DOWNLOAD IMG */

/**
 * Download an image.
 *
 * @param String url URL to image.
 * @param String dest Destination to download the image with image name and extension.
 */
module.exports = (url, dest = './image.jpg', cli = true) => {
	const ora = require('ora');
	const handleError = require('./handleError.js');
	const clearConsole = require('clear-any-console');
	const welcome = require('cli-welcome');
	const fs = require('fs');
	const path = require('path');
	const axios = require('axios');
	const chalk = require('chalk');
	const to = require('await-to-js').default;
	const green = chalk.bold.green;
	const yellow = chalk.bold.yellow;
	const dim = chalk.dim;
	const UPLOAD_DIR = dest;

	async function downloadImage(url) {
		const downloadPath = path.resolve(UPLOAD_DIR);
		const writer = fs.createWriteStream(downloadPath);

		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream'
		});

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
	}

	console.log();
	(async () => {
		if (cli) {
			clearConsole();

			// Welcome!
			welcome(`❯ Downloading Image`, '', {
				bgColor: `#FADC00`,
				color: `#000000`
			});

			// Init the spinner.
			const spinner = ora({ text: '' });
			spinner.start(`${yellow(`DOWNLOADING`)} the image`);

			if (!url) {
				spinner.warn(`${yellow(` URL`)} cannot be empty. \n${dim(`You forgot the first parameter.`)}\n`);
				process.exit(0);
			}

			const [err, down] = await to(downloadImage(url));
			handleError('DOWNLOADING', 'the demo image failed', err);

			// Spinner Step.
			spinner.succeed(`${green(`DOWNLOADED`)} the image in directory: ${dim(UPLOAD_DIR)}`);
			spinner.succeed(`ALL DONE! \n`);
		} else {
			if (!url) {
				const spinner = ora({ text: '' });
				spinner.warn(`${yellow(` URL`)} cannot be empty. \n${dim(`You forgot the first parameter.`)}\n`);
				process.exit(0);
			}

			const [err, down] = await to(downloadImage(url));
			handleError('DOWNLOADING', 'the demo image failed', err);
		}
	})();
};
