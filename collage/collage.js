function makeid(length) {
	var result = [];
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() *
			charactersLength)));
	}
	return result.join('');
}

function getCrop(image, size, clipPosition = 'center-middle') {
	const width = size.width;
	const height = size.height;
	const aspectRatio = width / height;

	let newWidth;
	let newHeight;

	const imageRatio = image.width / image.height;

	if (aspectRatio >= imageRatio) {
		newWidth = image.width;
		newHeight = image.width / aspectRatio;
	} else {
		newWidth = image.height * aspectRatio;
		newHeight = image.height;
	}

	let x = 0;
	let y = 0;
	if (clipPosition === 'left-top') {
		x = 0;
		y = 0;
	} else if (clipPosition === 'left-middle') {
		x = 0;
		y = (image.height - newHeight) / 2;
	} else if (clipPosition === 'left-bottom') {
		x = 0;
		y = image.height - newHeight;
	} else if (clipPosition === 'center-top') {
		x = (image.width - newWidth) / 2;
		y = 0;
	} else if (clipPosition === 'center-middle') {
		x = (image.width - newWidth) / 2;
		y = (image.height - newHeight) / 2;
	} else if (clipPosition === 'center-bottom') {
		x = (image.width - newWidth) / 2;
		y = image.height - newHeight;
	} else if (clipPosition === 'right-top') {
		x = image.width - newWidth;
		y = 0;
	} else if (clipPosition === 'right-middle') {
		x = image.width - newWidth;
		y = (image.height - newHeight) / 2;
	} else if (clipPosition === 'right-bottom') {
		x = image.width - newWidth;
		y = image.height - newHeight;
	} else if (clipPosition === 'scale') {
		x = 0;
		y = 0;
		newWidth = width;
		newHeight = height;
	} else {
		console.error(
			new Error('Unknown clip position property - ' + clipPosition)
		);
	}

	return {
		cropX: x,
		cropY: y,
		cropWidth: newWidth,
		cropHeight: newHeight,
	};
}

function rem(valueInPx) {
	let k = 1440;
	if (window.innerWidth <= 1000) {
		k = 376
	}
	let rem = (window.innerWidth / k) * valueInPx

	return rem;
}

function collage(settings, callback) {
	const { images, canvasWrapper, itemsContainers, canvasBG } = settings;
	const canvas = canvasWrapper.children[0];

	const prepareImages = () => {
		itemsContainers.forEach(itemContainer => {
			const imagesTemplate = itemContainer.images.reduce((acc, img) => {
				if (img.type == 'avatar') {
					acc += `
						<div class="collage-avatar collage-item" data-type='${img.type}' data-id='${img.id}' data-border-src='${img.src}'>
							<input class='collage-avatar__input'  type='file'></input>
							<div class='collage-avatar-userpic'>
								<img class='collage-avatar-userpic__img'  src='' />
							</div>
							<img class='collage-avatar__pin' src='${img.srcPin}' />
							<img class='collage-avatar__border' src='${img.src}'/>
						</div>
					`;

					return acc
				}
				acc += `<img data-id='${img.id}' data-type='${img.type || "image"}' class='collage-item' src='${img.src}'/>`;
				return acc;
			}, '');

			itemContainer.element.innerHTML = imagesTemplate
		});
	}

	function resizeCanvas() {
		canvas.width = canvasWrapper.offsetWidth
		canvas.height = canvasWrapper.offsetHeight;
	}

	function placeBackground() {
		new Promise((res, rej) => {
			let img = new Image(canvas.width, canvas.height);
			img.src = canvasBG;
			img.onload = function () {
				console.log('img load');
				let bgImg = new Konva.Image({
					name: 'scene-bg',
					x: 0,
					y: 0,
					image: img,
					// width: canvas.width,
					// height: canvas.height,
				});

				const textName = new Konva.Text({
					text: settings.textName.toUpperCase() || '',
					x: 0,
					y: rem(92),
					fontSize: rem(14), // lnh 21px
					fontFamily: 'Gotham Pro',
					shadowBlur: 10,
					shadowOffset: { x: 0, y: 4 },
					shadowOpacity: 0.5,
					fill: 'white',
					// rotation : -4.2,
				})

				// rem(55 + (210 / 2 - (textName.width() / 2)))
				textName.x(rem(58) + (rem(210) / 2) - (textName.width() / 2));

				if(settings.isMobile){
					textName.fontSize(rem(10))
					textName.y(rem(62)); 
					textName.x(rem(40) + rem(140 / 2) - (textName.width() / 2));
				}

				// textName.offsetX(textName.width() / 2);
				// textName.offsetY(textName.height() / 2);
				// textName.x(textName.x() + textName.width() / 2);
				// textName.y(textName.y() + textName.height() / 2);

				// textName.y(rem(98))
				textName.rotation(-4.2)
				
				misc.add(bgImg);
				misc.add(textName);
				layer.batchDraw();
				res();
			}
		}).then(() => {
			// trash
			new Promise((res, rej) => {
				let img = new Image(60, 60);
				img.src = document.querySelector('.collage-hidden__trash').src;
				let w = 60;
				let h = 60;

				img.onload = function () {
					let canvImg = new Konva.Image({
						name: 'trash',
						x: rem(20),
						y: canvas.height - h - rem(20),
						image: img,
						width: w,
						height: h,
						visible: false,
					});
					if (settings.isMobile) {
						canvImg.x(canvas.width / 2 - (w / 2));
						canvImg.y(canvas.height - h - rem(13))
					}
					misc.add(canvImg);
					layer.batchDraw();
				}


			})
		})

	}

	function toggleTrash(state = 'hide') {
		if (state == 'hide') {
			stage.find('.trash').visible(false)
		}
		if (state == 'show') {
			stage.find('.trash').visible(true)
		}

		layer.draw();
	}


	prepareImages();

	resizeCanvas();

	const stage = new Konva.Stage({
		container: '.cavnas-here',
		width: canvas.width,
		height: canvas.height,
	});

	const misc = new Konva.Group({ name: 'misc' });
	let content = new Konva.Group({ name: 'view' });

	const layer = new Konva.Layer();
	
	const transformerSettings = {
		name: 'transformer',
		anchorStroke: 'white',
		anchorFill: 'white',
		anchorSize: 9,
		borderStroke: 'white',
		enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
		nodes: [],
	}
	
	let transformer;
	transformer = new Konva.Transformer(transformerSettings);
	content.add(transformer);
	
	layer.add(misc);
	layer.add(content);

	
	placeBackground();


	window.stage = stage


	const addItem = (item) => {
		console.log(item.height);
		let img = new Image(item.width, item.height);

		img.onload = function () {
			console.log('img load');
			console.log(item);
			let canvasImg = new Konva.Image({
				name: 'item',
				x: canvas.width / 2 - (img.width / 2),
				y: canvas.height / 2 - (img.height / 2),
				image: img,
				width: img.width,
				height: img.height,
				draggable: true,
				data: {
					id: item.dataset.id
				}
			});

			// if(settings.isMobile){
			// 	canvasImg.width(item.width)
			// 	canvasImg.height(item.height)
			// }

			content.add(canvasImg);
			transformer.nodes([])
			layer.batchDraw();
		}

		img.src = item.src;
	}

	const addPhoto = (item) => {
		let photo = new Image(item.naturalWidth, item.naturalHeight);
		const borderImg = item.parentElement.parentElement.querySelector('.collage-avatar__border');
		const border = new Image(borderImg.width, borderImg.height);
		const pinImg = item.parentElement.parentElement.querySelector('.collage-avatar__pin');
		const pin = new Image(pinImg.width, pinImg.height);

		border.src = borderImg.src;
		photo.src = item.src;
		pin.src = pinImg.src;
		const group = new Konva.Group({
			name: 'item photo',
			x: canvas.width / 2 - (item.width / 2),
			y: canvas.height / 2 - (item.height / 2),
			draggable: true,
			data: {
				id: item.parentElement.parentElement.dataset.id
			}
		});

		console.log(item);
		content.add(group);

		let borderBG;

		new Promise((res, rej) => {
			border.onload = function () {
				console.log('photo-bg');
				let borderBG = new Konva.Image({
					name: 'photo photo-bg',
					image: border,
					width: rem(157),
					height: rem(157),
				});

				group.add(borderBG);

				res(group);
			}
		}).then((r) => {
			return new Promise((res, rej) => {
				console.log('photo-img');

				// photo
				let photoImg = new Konva.Image({
					name: 'photo photo-img',
					image: photo,
					x: rem(10),
					y: rem(9),
					width: rem(139),
					height: rem(129),
				});


				let sImg = photoImg.image();

				console.log(sImg);
				const newCrop = getCrop(
					photoImg.image(),
					{ width: rem(139), height: rem(129) },
					'center-middle'
				);

				photoImg.setAttrs(newCrop);

				group.add(photoImg);
				res(r)
			})
		}).then((r) => {
			return new Promise((res, rej) => {
				console.log('pin-img');
				let pinImg = new Konva.Image({
					name: 'photo pin-img',
					image: pin,
					width: pin.width,
					height: pin.height,
					x: (r.find('.photo-bg')[0].width() / 2) - pin.width / 2,
					y: rem(-30),
				});
				console.log(pin);
				console.log('pin');

				group.add(pinImg);
				layer.batchDraw();
				res(r)
			})
		}).then((r) => {
			r.width(r.getClientRect().width)
			r.height(r.getClientRect().height)
		})
		
	}

	const placeImageToAvatar = (e) => {
		console.log(e.target);
		e.target.onchange = evt => {
			const [file] = e.target.files
			if (file) {
				if (!(file.type == 'image/png' || file.type == 'image/jpeg')) {
					return console.error('file extention must be .png or .jpg');
				}
				
				downscale(file, 500, 500, {returnBlob: 1}).then((b64) => { // b64 also blob
					e.target.parentElement.querySelector('.collage-avatar-userpic__img').src = URL.createObjectURL(b64);
					e.target.parentNode.classList.add('has-photo')
				})
			}
		}
	}

	// handling item containers
	itemsContainers.forEach(itemContainer => {
		itemContainer.element.addEventListener('click', function (e) {
			if (e.target.classList.contains('collage-item') && !(e.target.classList.contains('active'))) {
				e.target.classList.add('active');
				addItem(e.target);

				return
			}

			if (e.target.classList.contains('collage-avatar__input')) {

				if (!e.target.parentElement.classList.contains('has-photo')) {
					placeImageToAvatar(e);
					return
				}

				e.preventDefault();
				e.target.parentElement.classList.add('active');
				const userImg = e.target.parentElement.children[1].children[0];

				addPhoto(userImg);

				return
			}
		})
	});

	// handling canvas 
	stage.on('click tap dragstart', function (e) {
		let shape = e.target;
		console.log(shape);
		if (shape.hasName('scene-bg')) {
			transformer.visible(false);
			toggleTrash('hide');
		}

		if (shape.hasName('item')) {
			stage.find('.item').removeName('active');
			console.log(shape);
			shape.addName('active');
			transformer.nodes([e.target]);
			shape.moveToTop();
			transformer.moveToTop();
			transformer.visible(true);
			toggleTrash('show');

			layer.draw();
		}

		if (shape.hasName('photo')) {
			console.log(shape.findAncestor('.item'));
			let photo = shape.findAncestor('.item', true);

			console.log(photo);
			photo.addName('active');
			toggleTrash('show');

			transformer.nodes([photo]);
			transformer.visible(true);
			layer.draw();

			return
		}

		if (shape.name() == 'trash') {
			let activeNode = stage.find((node) => {
				return node.hasName('item') && node.hasName('active');
			})[0];
			console.log(activeNode);
			document.querySelector(`[data-id='${activeNode.attrs.data.id}']`).classList.remove('active');
			activeNode.destroy();
			console.log(shape);
			transformer.nodes([]);
			toggleTrash('hide');

			layer.draw();
		}

		layer.draw();

	});


	function resetCollage() {
		document.querySelectorAll('.collage-item').forEach(el => el.classList.remove('active'));
		content.destroyChildren();
		toggleTrash('hide');
		layer.draw();

		document.querySelectorAll('.collage-item').forEach(el => {
			el.classList.remove('has-photo');
		})

		transformer = new Konva.Transformer(transformerSettings);
		content.add(transformer);
	}

	function makeScreenshot(callback) {
		function downloadURI(uri, name) {
			var link = document.createElement('a');
			link.download = name;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			delete link;
		}
		
		function adjustScale(curSize, reqSize){
			const scale = reqSize / curSize
			return scale
		}
		
		toggleTrash('hide');
		transformer.visible(false)

		const screenShotSize = 1000; //px
		stage.width(screenShotSize);
		stage.height(screenShotSize);
		stage.scale({x: adjustScale(canvas.width, screenShotSize), y: adjustScale(canvas.width, screenShotSize)});
		var dataURL = stage.toDataURL();
		// downloadURI(dataURL, `collage-${makeid(5)}.png`);
		
		transformer.visible(true);
		stage.scale({x: 1, y: 1});
		stage.width(canvas.width);
		stage.height(canvas.height);
		
		if (callback) {
			callback(dataURL);
		}
	}

	stage.add(layer);

	layer.draw();

	return {
		layer,
		reset: resetCollage,
		makeScreenshot,
	}
}

