/* Importing Modules */
import express from 'express';
import session from 'express-session';
import Enmap from 'enmap';
import path from 'path';
import {Server} from 'socket.io';
import parser from 'body-parser';
import morgan from 'morgan';
import http from 'http';

/* Calling the enmap constructor */
const login: Enmap = new Enmap({
	dataDir: './data',
});

/* Calling the express function */
const app = express();

/* Making the http server */
const server = http.createServer(app);

/* Initializing socket */
const io = new Server(server);

/* Listening when a user connects */
io.on('connection', (socket: any) => {
	console.log('A user connected');
	/* Listening for when a user disconnects */
	socket.on('disconnect', () => {
		console.log('A user left the site');
	});
});

/* Setting the view engine */
app.set('view engine', 'ejs');

/* Registering middlewares */
app.use(express.static(path.join(__dirname, 'public')));

app.use(parser.urlencoded({
	extended: true,
}));

app.use(parser.json());

/* Setup HTTP logger */
app.use(morgan('dev'));

/* Set session storage (cookies) */
app.use(session({
	resave: true,
	saveUninitialized: false,
	secret: '<%$^&*(1n*&):-+{78*9}l@)^%>',
}));

/* Set views directory */
app.set('views', path.join(__dirname, 'views'));

/* Listening to the port */
server.listen(3000 || 3001, () => {
	console.log('Web server is now online!');
});

app.get('/', async (req: any, res: any) => {
	let val = await login.get('requests-rec');
	if (!val) {
		val = 0;
	}

	login.set('requests-rec', val + 1);
	res.render('index', {
		requests: val,
	});
});

/* Export the database */
export default {
	db: login,
	api: app,
};
