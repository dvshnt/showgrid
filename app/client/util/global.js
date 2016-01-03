function is_touch_device() {
	return (('ontouchstart' in window)
	|| (navigator.MaxTouchPoints > 0)
	|| (navigator.msMaxTouchPoints > 0));
}
window.is_touch = is_touch_device();