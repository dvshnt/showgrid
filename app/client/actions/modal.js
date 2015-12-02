export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
export const HIDE_LOGIN_MODAL = 'HIDE_LOGIN_MODAL';

export const SHOW_PHONE_MODAL = 'SHOW_PHONE_MODAL';
export const HIDE_PHONE_MODAL = 'HIDE_PHONE_MODAL';


export function showLoginModal(mode) {
	return {
		type: SHOW_LOGIN_MODAL,
		mode: mode || "login"
	};
}

export function hideLoginModal() {
	return {
		type: HIDE_LOGIN_MODAL
	};
}


export function showPhoneModal() {
	return {
		type: SHOW_PHONE_MODAL
	};
}


export function hidePhoneModal() {
	return {
		type: HIDE_PHONE_MODAL
	};
}