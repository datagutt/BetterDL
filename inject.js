import ChatModule from './modules/ChatModule.js';
class BetterDL {
	loadPredicates = {
		chat: () => !!document.querySelectorAll('.v-chatroom-message .chatbody').length
	}

	constructor(vueApp){
		this.vueApp = vueApp;
	}

	// Big thanks to BetterTTV for this code
	async waitForLoad(type, context = null){
		let timeout;
		let interval;
		const startTime = Date.now();
		await Promise.race([
			new Promise(resolve => {
				timeout = setTimeout(resolve, 10000);
			}),
			new Promise(resolve => {
				const loaded = this.loadPredicates[type];
				if (loaded(context)) {
					resolve();
					return;
				}
				interval = setInterval(() => loaded(context) && resolve(), 25);
			})
		]);
		console.log(`waited for ${type} load: ${Date.now() - startTime}ms`);
		clearTimeout(timeout);
		clearInterval(interval);
	}

	onRouteChange(location) {
		switch(location.name){
			case 'Livestream':
				this.waitForLoad('chat').then(() => {
					let c = new ChatModule;
					console.log('c', c);
					c.start();
				});
			break;
		}
	}

	start() {
		let {vueApp} = this;
		console.log('vueApp', vueApp)
		if(vueApp && vueApp.$router){
			let _cb = vueApp.$router.history.cb.bind(vueApp.$router);
			vueApp.$router.history.listen((location) => {
				_cb(location);
				this.onRouteChange(location);
			});
			this.onRouteChange(vueApp.$router.history.current);
		}else{
			throw Error('No Vue app found');
		}
	}
}

let instance = new BetterDL(window.app.__vue__);
instance.start();