import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaArrowCircleLeft, FaArrowRight, FaLongArrowAltLeft, FaPencilAlt, FaTrash } from "react-icons/fa";

function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [members, setMembers] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [deleteArray, setDeleteArray] = useState([])
  const [checkedState, setCheckedState] = useState([])
  const [members_, setMembers_] = useState([]);
  const [checkbox, setCheckBox] = useState(false);
  const [clickRow, setClickRow] = useState(-1);
  const [editable, setEditable] = useState(-1);

  useEffect(() => {
    let url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
    axios.get(url).then((response) => {
      if (response !== null && response?.status === 200) {
        setMembers(response.data);
        setMembers_(response.data);
        setCurrentRecords(response.data.slice(indexOfFirstRecord, indexOfLastRecord))
        let arr = new Array(response.data.length).fill(false);
        setCheckedState(arr);
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  let indexOfLastRecord = currentPage * recordsPerPage;
  let indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  let noOfPages = Math.ceil(members.length / recordsPerPage);
  let records = members.slice(indexOfFirstRecord, indexOfLastRecord);
  

  const handleChange = (e) => {
    console.log(e);
    let si = e.target.value
    e.preventDefault();
   

    let membersFiltered = members;
    if (e.target.value.length > 1) {
      membersFiltered = members_.filter((mem) => {
        return mem.name.match(si) || mem.email.match(si) || mem.role.match(si);
      });
    } else {
      membersFiltered = members_;
    }
    setMembers(membersFiltered);
    records = membersFiltered.slice(indexOfFirstRecord, indexOfLastRecord);
    setCurrentRecords(records);
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };


  function handleCheckbox(e, item) {
    const updatedCheckedState = checkedState.map((item_, index) =>
      index === item.id-1 ? !item_ : item_
    );

    setCheckedState(updatedCheckedState);
    let deleteArray_ = deleteArray;
    const index = deleteArray_.indexOf(item);
    if (index > -1) {
      deleteArray_.splice(index, 1);
    } else {
      deleteArray_.push(item); //push index
    }
    setDeleteArray(deleteArray_);
  }


  function checkAll() {
    let deleteArray_ = [];
    let updatedCheckedState = checkedState;

    for (let i = 0; i < currentRecords.length; i++) {
      if (!checkbox)
        deleteArray_.push(currentRecords[i]);
      updatedCheckedState[currentRecords[i].id - 1] = !checkbox ? true : false;
    }

    setCheckedState(updatedCheckedState);
    setDeleteArray(deleteArray_);
    setCheckBox(!checkbox);
  }

  function changePage(i) {
    console.log(i);
    setCurrentPage(i);
    indexOfLastRecord = i * recordsPerPage;
    indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    records = members.slice(indexOfFirstRecord, indexOfLastRecord);
    setCurrentRecords(records);
  }

  function deleteRows() {
    let newMembers = members;
    let deleteArray_ =  deleteArray;
    console.log(deleteArray_);

    for (let i = 0; i < deleteArray_.length; i++) {
      let idx = newMembers.indexOf(deleteArray_[i]);
      newMembers.splice(idx, 1);
    }
    setMembers(newMembers);
    setCurrentRecords(members.slice(indexOfFirstRecord, indexOfLastRecord));
    setDeleteArray([]);
    const updatedCheckedState = checkedState.map((item, index) =>
      false
    );
    console.log(updatedCheckedState);
    setCheckedState(updatedCheckedState);
    setCheckBox(false);
  }

  function deleteEachRow(list) {
    let newMembers = members;
    let idx = newMembers.indexOf(list);
    newMembers.splice(idx, 1);
    setMembers(newMembers);
    records = newMembers.slice(indexOfFirstRecord, indexOfLastRecord);
    setCurrentRecords(records);
  }

  function changeDetails(e, index, type) {

    let detail = e.target.value;

    let mem = members[index];
    if (type == 'name')
      mem.name = detail;
    else if (type == 'role')
      mem.role = detail;
    else if (type == 'email')
      mem.email = detail;
    members[index] = mem;

    setMembers(members);

  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      setEditable(-1);
    }
  }

  function listItems(myList, index) {
    return (
      <div className="container"
        onDoubleClick={() => setClickRow(myList.id)}
        style={{ backgroundColor: editable == myList.id ? '#96E3F7' : myList.id == clickRow ? '#848096' : 'transparent' }}>
        <div className='container-content'>
          <input value={'test'} type='checkbox'
            style={{ alignSelf: 'center' }}
            onChange={(e) => handleCheckbox(e, myList)}
            checked={checkedState[myList.id - 1]}
          />

        </div>

        <div className='container-content'>
          {editable != myList.id ?
            <p>{myList.name}</p> :
            <input className='input-detail' type='text' defaultValue={myList.name} onChange={(e) => changeDetails(e, index, 'name')} onKeyDown={(e) => onKeyDown(e)} />
          }
        </div>
        <div className='container-content' >
          {editable != myList.id ?
            <p>{myList.email}</p> :
            <input className='input-detail' type='text' defaultValue={myList.email} onChange={(e) => changeDetails(e, index, 'email')} onKeyDown={(e) => onKeyDown(e)} />
          }
        </div>
        <div className='container-content'>
          {editable != myList.id ?
            <p>{myList.role}</p> :
            <input className='input-detail' type='text' defaultValue={myList.role} onChange={(e) => changeDetails(e, index, 'role')} onKeyDown={(e) => onKeyDown(e)} />
          }
        </div>
        <div className='container-content'>
          <button className='icon-button' onClick={() => editable != myList.id ? setEditable(myList.id): setEditable(-1)}> <FaPencilAlt style={{ marginRight: 12, marginLeft: 5 }} /></button>
          <button className='icon-button' onClick={() => deleteEachRow(myList)}><FaTrash color='#ff5171' /></button>
        </div>
      </div>
    )
  }

  function pagination() {
    let pagination = []
    for (let i = 1; i <= noOfPages; i++) {
      pagination.push(
        <button style={{ margin: 10, backgroundColor: currentPage == i ? '#2F3142' : '#A1A7E3', borderRadius: 20, color: 'white', width: 36, height: 36 }} onClick={() =>
          changePage(i)}>{i}</button>
      )
    }
    return pagination
  }

  return (
    <div className='mainContainer'>
      <div style={{ margin: 10,marginBottom:0,flex:1 }}>
        <input
          style={{ width: '95%', alignSelf: 'flex-start', height: 20, padding: 10, borderRadius: 4 }}
          type="text"
          placeholder="Search name, email, role"
          onChange={handleChange}
          value={searchInput} />
      </div>

      <div style={{ alignItems: 'center', height: '70%', width: '95%', marginLeft: '2.5%' }}>

        <div className='container'>
          <div className='container-content'>
            <input value={'test'} type='checkbox'
              style={{ alignSelf: 'center',backgroundColor:'#ff5171' }}
              onChange={(e) => checkAll()}
              checked={checkbox}
            />
          </div>
          <div className='container-content'>
            <p className='text-heading'>Name</p>
          </div>
          <div className='container-content'>
            <p className='text-heading'>Email</p>
          </div>
          <div className='container-content'>
            <p className='text-heading'>Role</p>
          </div>
          <div className='container-content'>
            <p className='text-heading'>Actions</p>
          </div>
        </div>

        {currentRecords.map((myList, index) => {
          return listItems(myList, index)
        })}

      </div>
      <div style={{ flexDirection: 'row', display: 'flex' ,height:'20%',flex:1}}>
        <div style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
          <button type='button' className='delete-button' onClick={() => deleteRows()}>
            <p className='delete-text'>{'Delete Selected'}</p>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', alignSelf: 'center' }}>
          
          <button className='icon-button2' disabled={currentPage==1}
           onClick={() =>
            changePage(1)} > <FaAngleDoubleLeft /></button>
              <button className='icon-button2'  disabled={currentPage==1}
              onClick={() =>
            changePage(currentPage-1)} > <FaAngleLeft /></button>
          {pagination()}
          <button className='icon-button2' disabled={currentPage==noOfPages}
          onClick={() => changePage(currentPage+1)}> <FaAngleRight /></button>
          <button className='icon-button2' disabled={currentPage==noOfPages}
          onClick={() => changePage(noOfPages)}> <FaAngleDoubleRight /></button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;