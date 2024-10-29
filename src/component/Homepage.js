import { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Table,
    Toast
} from 'react-bootstrap';
import { Link, redirect } from 'react-router-dom';
import ToastComp from './Toast';
import ModalComp from './Modalcomp';

function Homepage() {

    const [students, setStudents] = useState([]);

    const [student, setStudent] = useState({
        name: '',
        studentCode: '',
        isActive: '',
    });

    const [numberStudents, setNumberStudents] = useState(0);
    const [checkedStudents, setCheckedStudents] = useState([]);

    const [showSuccessAdd, setShowSuccessAdd] = useState(false);
    const [showSuccessDelete, setShowSuccessDelete] = useState(false);
    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);

    const [show, setShow] = useState(false);
    const [updateStudent, setUpdateStudent] = useState('');

    useEffect(() => {
        setNumberStudents(checkedStudents.length);
    }, [checkedStudents]);

    const getAllStudents = async () => {
        try {
            const res = await fetch('https://student-api-nestjs.onrender.com/students');
            const dataRes = await res.json();
            setStudents(dataRes.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    const handleChange = (e) => {
        let newStudent = {};
        if (e.target.name === 'isActive') {
            newStudent = {
                ...student,
                isActive: !student.isActive,
            }
        }
        else {
            newStudent = {
                ...student,
                [e.target.name]: e.target.value,
            }
        }
        setStudent(newStudent);
    };

    console.log(student);

    const handleAdd = async () => {
        try {
            await fetch('https://student-api-nestjs.onrender.com/students', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(student),
            });
            // window.location.reload();
            await getAllStudents();
            setStudent({
                name: '',
                studentCode: '',
                isActive: '',
            })
            setShowSuccessAdd(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {

        try {
            await fetch(`https://student-api-nestjs.onrender.com/students/${id}`, {
                method: 'DELETE',
            });
            await getAllStudents();
            setShowSuccessDelete(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowModalUpdate = (student) => {
        setUpdateStudent(student);
        setShow(!show);
    };

    const handleCloseModalUpdate = () => {
        setShow(!show);
    };

    console.log(checkedStudents);

    const handleCheckBox = (id) => {
        setCheckedStudents(prev => {
            if (prev.includes(id)) {
                return prev.filter((item) => (item !== id));
            }
            else {
                return [...prev, id];
            }
        });
    };

    const handleClear = () => {
        setStudents([]);
        setNumberStudents(0);
        setCheckedStudents([]);
    };

    const handleCloseSuccessDelete = () => {
        setShowSuccessDelete(!showSuccessDelete);
    };  

    const handleCloseSuccessUpdate = () => {
        setShowSuccessUpdate(!showSuccessUpdate);
    };

    return (
        <Container style={{ position: 'relative' }}>
            <Row  className='mt-5'>
                <Col><h1>Total Selected Students: {numberStudents}</h1></Col>
                <Col><Button variant='primary' style={{width:'10%',height:'80%'}} onClick={handleClear}>Clear</Button></Col>
            </Row>
            <Row className='mt-5'>
                <Col md='6'>
                    <Form style={{ display: 'flex', flexDirection: 'column' }}>
                        <Container>
                            <Row>
                                <Form.Group className="mb-3" controlId="studentName">
                                    <Form.Label>Student Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Student Name"
                                        name='name'
                                        value={student.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" controlId='studentCode'>
                                    <Form.Label>Student Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Enter Student Code'
                                        name='studentCode'
                                        value={student.studentCode}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Check
                                    type='checkbox'
                                    label='Still active'
                                    name='isActive'
                                    checked={student.isActive}
                                    onChange={handleChange}
                                    id='isActive'
                                />
                            </Row>

                        </Container>
                    </Form>
                </Col>
                <Col className='justify-content-center mt-4'>
                    <Col >
                        <Button className='mt-2' variant='primary' onClick={handleAdd}>Add</Button>
                    </Col>
                </Col>
            </Row>
            <Row className='mt-5'>
                <Table hover size="">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Student Name</th>
                            <th>Student Code</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students.map((student) => {
                                return (
                                    <tr key={student._id} style={{ verticalAlign: 'middle' }}>
                                        <td>
                                            <Form.Check
                                                type='checkbox'
                                                checked={checkedStudents.includes(student._id)}
                                                onChange={() => handleCheckBox(student._id)}
                                            />
                                        </td>
                                        <td><Link to={`/details/${student._id}`}>{student.name}</Link></td>
                                        <td>{student.studentCode}</td>
                                        <td>
                                            {!student.isActive ? (<Button variant='danger' disabled>In-Active</Button>) : (<Button variant='primary' disabled>Active</Button>)}
                                        </td>
                                        <td>
                                            <Button variant='danger' onClick={() => handleDelete(student._id)}>Delete</Button>
                                            <Button className='ms-2' variant='secondary' onClick={() => handleShowModalUpdate(student)}>Update</Button>

                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Row>
            <ToastComp showMessage={showSuccessAdd} onClose={() => setShowSuccessAdd(!showSuccessAdd)} message={'Successfully Add !'} background={'success'} />
            <ToastComp showMessage={showSuccessDelete} onClose={handleCloseSuccessDelete} message={'Successfully deleted !'} background={'success'} />
            <ToastComp showMessage={showSuccessUpdate} onClose={handleCloseSuccessUpdate} message={'Successfully updated !'} background={'success'} />

            {show && (<ModalComp show={show} handleClose={handleCloseModalUpdate} handleShow={handleShowModalUpdate} student={updateStudent} fetchData={getAllStudents} showToast={() => setShowSuccessUpdate(!showSuccessUpdate)} />)}
        </Container >
    )
}

export default Homepage;