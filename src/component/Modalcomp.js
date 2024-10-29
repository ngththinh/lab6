import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Modalcomp({ show, handleClose, student, fetchData, showToast }) {
   
    const [name, setName] = useState(student?.name);
    const [code, setCode] = useState(student?.studentCode);
    const [isActive, setIsActive] = useState(student?.isActive);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };
    const handleIsActiveChange = () => {
        setIsActive(!isActive);
    };

    const handleSave = async () => {
        await fetch(`https://student-api-nestjs.onrender.com/students/${student._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                studentCode: code,
                isActive: isActive,
            }),
        });
        await fetchData();
        handleClose();
        showToast();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Student Name</Form.Label>
                            <Form.Control
                                value={name}
                                type="text"

                                autoFocus
                                onChange={handleNameChange}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Student Code</Form.Label>
                            <Form.Control
                                value={code}
                                type="text"

                                onChange={handleCodeChange}
                            />
                        </Form.Group>
                        <Form.Check
                            type='checkbox'
                            label='Still active'
                            name='isActiveUpdate'
                            checked={isActive}
                            onChange={handleIsActiveChange}
                            id='isActiveUpdate'
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Modalcomp;