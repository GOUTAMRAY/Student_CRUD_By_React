import { Button, Card, CardHeader, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { IoEye } from "react-icons/io5";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./Student.css"


const Student = () => {
  const [modal , setModal ] = useState(false);
  const [modalSingle , setModalSingle ] = useState(false);
  const [modalEdit , setModalEdit ] = useState(false);
  const [student , setStudent ] = useState([]);
  const [ singleview , setsingleview ] = useState([]);

  const [input, setInput ] = useState({
    name : "",
    email: "",
    age : "",
    roll : "",
    photo : "",

  });


   // single  modal show
   const handleSingleModalShow = ()  => {
    setModalSingle(true);
  }; 

   // single  modal hide
   const handleSingleModalHide = ()  => {
    setModalSingle(false);
  };



    // show modal 
    const handleModalShow = ()  => {
      setModal(true);
    };
  
    // Hide  modal 
    const handleModalHide = ()  => {
      setModal(false);
      setInput({
        name : "",
        email: "",
        age : "",
        roll : "",
        photo : "",
      })
    };

  // get all students 
  const getAllStudents = async () => {

   const response =  await axios.get("http://localhost:5000/students");
   setStudent(response.data);
  };


  
  // get single student 
  const handleSingleView = (id) => {
    const singleStu = student.find(data => data.id === id)
   
    setsingleview(singleStu)
    handleSingleModalShow();
  }






  //update show modal 
  const handleModalEditShow = ()  => {
    setModalEdit(true);
  };

  // update Hide  modal 
  const handleModalEditHide = ()  => {
    setModalEdit(false);
    setInput({
      name : "",
      email: "",
      age : "",
      roll : "",
      photo : "",
    })
  };

  // handle Input data 
  const handleInputChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value
    }))
  }
 

  //handleCreateStudent
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    if(!input.name || !input.roll || !input.email || !input.age || !input.photo){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are Required!",
      
      });
    }else{
      await axios.post("http://localhost:5000/students", input);
      setInput({
        name : "",
        email: "",
        age : "",
        roll : "",
        photo : "",
      });

      getAllStudents();
      handleModalHide();

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Student created successfull",
        showConfirmButton: false,
        timer: 1500
      });
      
    }
  }

  // Edit handle Student 
  const handleStudentEdit = (id) => {
    setInput(student.find(data => data.id === id));  
    handleModalEditShow()
  }

  // update student 
  const handleUpdateStudent = async (e) => {
      e.preventDefault();

      await axios.patch(`http://localhost:5000/students/${input.id}`, input)
     
      getAllStudents();
      handleModalEditHide();
      Swal.fire("Updated SuccessFull!");
  }

// delete student 
const handleDeleteStudent = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
         axios.delete(`http://localhost:5000/students/${id}`)

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
      getAllStudents();
    }
  });
}

useEffect(() => {
  getAllStudents();
}, []);

  return (
    <>
      <Container className="my-5"> 
        <Row className="my-4 justify-content-center"> 
          <Col md={8}> 
          <Button onClick={handleModalShow}> Add New Student </Button> 
             <Card className="shadow mt-2"> 
               <Card.Header>
                  <Card.Title>
                    <h2 style={{textAlign:"center"}}> All Student Data </h2>
                  </Card.Title>
               </Card.Header>
               <Card.Body>
                  <Table className="bordered table-striped"> 
                     <thead>
                       <tr> 
                        <th> # </th>
                        <th> Photo </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Age </th>
                        <th> Roll </th>
                        <th> Action </th>
                       </tr>
                     </thead>
                     <tbody>
                      {student.length === 0 ? "Student Not Found" : student.map((item, index) => {
                        return <tr className="align-middle" key={index}>
                        <td> {index + 1} </td>
                        <td> 
                          <img style={{width:"60px", height: "60px", borderRadius:"50%"}} src={item.photo} alt="" />
                        </td>
                        <td> {item.name} </td>
                        <td> {item.email} </td>
                        <td> {item.age} </td>
                        <td> {item.roll}</td>
                        <td> 
                          <Button variant="success" onClick={() => handleSingleView(item.id)}> <IoEye /> </Button> &nbsp;
                          <Button variant="info" onClick={() => handleStudentEdit(item.id)}>  <FaEdit /> </Button> &nbsp;
                          <Button variant="danger" onClick={() => handleDeleteStudent(item.id)}> <FaTrashAlt /> </Button>
                        </td>
                       </tr>
                      })}
                         
                     </tbody>

                  </Table>
               </Card.Body>
             </Card>
          </Col>
        </Row>
      </Container>

      {/* // create student modal  */}
      <Modal show={modal} centered  onHide={handleModalHide}> 
        <Modal.Header>
           <h2> Create new student </h2>
        </Modal.Header>
        <Modal.Body> 
          <form onSubmit={handleCreateStudent}>
             <div className="my-3">
              <label > Name  </label>
              <input type="text" className="form-control" name="name" value={input.name} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Email  </label>
              <input type="email" className="form-control" name="email" value={input.email} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Age  </label>
              <input type="text" className="form-control" name="age" value={input.age} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Roll  </label>
              <input type="text" className="form-control" name="roll" value={input.roll} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Photo  </label>
              <input type="text" className="form-control" name="photo" value={input.photo} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <Button type="submit"> Create </Button>
             </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* // update student modal  */}
      <Modal show={modalEdit} centered  onHide={handleModalEditHide}> 
        <Modal.Header>
           <h2> Update student </h2>
        </Modal.Header>
        <Modal.Body> 
          <form onSubmit={handleUpdateStudent}>
             <div className="my-3">
              <label > Name  </label>
              <input type="text" className="form-control" name="name" value={input.name} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Email  </label>
              <input type="email" className="form-control" name="email" value={input.email} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Age  </label>
              <input type="text" className="form-control" name="age" value={input.age} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Roll  </label>
              <input type="text" className="form-control" name="roll" value={input.roll} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <label > Photo  </label>
              <input type="text" className="form-control" name="photo" value={input.photo} onChange={handleInputChange} />
             </div>
             <div className="my-3">
              <Button type="submit"> Create </Button>
             </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* view modal student */}
      <Modal show={modalSingle} className="singleModal" onHide={handleSingleModalHide}> 
        <Card className="modal-box">
           <CardHeader className="card-header"> 
            <div className="col colllum">
                <button onClick={handleSingleModalHide}> X </button>
            </div>
      
            </CardHeader>
          <Card.Body> 
               <img style={{width: "460px", height: "400px", objectFit: "cover" }} src={singleview.photo} alt="" />
               <h2> Name : <span> {singleview.name} </span> </h2>
               <h4> Email : <span> {singleview.email} </span> </h4>
               <h4> Roll : <span> {singleview.roll} </span> </h4>
          </Card.Body>
        
        </Card>
      </Modal>
    </>
  )
}

export default Student;












