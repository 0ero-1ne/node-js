import express from 'express';
import facultyRoutes from './routes/faculty-routes.js';
import pulpitRoutes from './routes/pulpit-routes.js';
import subjectRoutes from './routes/subject-routes.js';
import teacherRoutes from './routes/teacher-routes.js';
import auditoriumTypeRoutes from './routes/auditorium-type-routes.js';
import auditoriumRoutes from './routes/auditorium-routes.js';

const app = express();

app.use(express.json());

app.use('/api/faculties', facultyRoutes);
app.use('/api/pulpits', pulpitRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/auditorium-types', auditoriumTypeRoutes);
app.use('/api/auditoriums', auditoriumRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>');
});

app.listen(3000, () => {
    console.log('Server running on localhost:3000');
});