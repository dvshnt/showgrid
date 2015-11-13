import { Schema, arrayOf } from 'normalizr';


const venueSchema = new Schema('venue');


const showSchema = new Schema('shows');


const alertSchema = new Schema('alerts');
alertSchema.define({
	user: userSchema,
	show: showSchema
});


const userSchema = new Schema('users');
userSchema.define({
	alerts: arrayOf(alertSchema),
	favorites: arrayOf(showSchema)
});


const venueListSchema = new Schema('venues');
venueListSchema.define({
	shows: arrayOf(showSchema)
});


// Schemas for Github API responses.
export const Schemas = {
	VENUE_LIST: venueListSchema,
	VENUE: venueSchema,
	ALERT: alertSchema,
	SHOW: showSchema,
	USER: userSchema
};