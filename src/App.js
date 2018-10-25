import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      searchText: "",
      searchedCourses: [],
      newAddEditCourse: {
        id: "",
        name: "",
        credit: "",
        subject: ""
      },
      likedCourses: [],
      editIndex: null
    };
    this.renderLists = this.renderLists.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.renderConfirmation = this.renderConfirmation.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.editCourse = this.editCourse.bind(this);
  }
  componentDidMount() {
    fetch('courses.txt')
      .then((r) => r.text())
      .then((data) => {
        const arr = data.split('\n');
        const courses = arr.map((course) => {
          const subjectIndex = course.lastIndexOf(' ');
          const creditIndex = course.lastIndexOf(' ', subjectIndex - 1);
          const idIndex = course.indexOf(' ');
          const id = course.slice(0, idIndex);
          const name = course.slice(idIndex + 1, creditIndex);
          const credit = course.slice(creditIndex + 1, subjectIndex);
          const subject = course.slice(subjectIndex + 1);
          return {
            id,
            name,
            credit,
            subject
          }
        })
        this.setState({ courses });
      });
  }
  renderLists(searchText) {
    const { searchedCourses, courses } = this.state;
    const renderedCourses = (searchText !== '') ? searchedCourses : courses;
    return renderedCourses.map((course, i) => <li key={course.id}>{course.id} {course.name} {course.credit} {course.subject} <button onClick={() => this.handleEdit(i)}>Edit</button><button onClick={() => this.handleLike(i)}>Favourite</button></li>)
  }
  renderSearchBar() {
    return (
      <div>
        <input value={this.state.searchText} onChange={(e) => {
          this.setState({ searchText: e.target.value });
          this.handleSearch(e.target.value);
        }} />
        <span>Search</span>
      </div>
    );
  }
  renderAddEditForm() {
    const { id, name, credit, subject } = this.state.newAddEditCourse;
    return (
      <div>
        <input value={id} onChange={(e) => this.setState({ newAddEditCourse: { ...this.state.newAddEditCourse, id: e.target.value } })} />
        <input value={name} onChange={(e) => this.setState({ newAddEditCourse: { ...this.state.newAddEditCourse, name: e.target.value } })} />
        <input value={credit} onChange={(e) => this.setState({ newAddEditCourse: { ...this.state.newAddEditCourse, credit: e.target.value } })} />
        <input value={subject} onChange={(e) => this.setState({ newAddEditCourse: { ...this.state.newAddEditCourse, subject: e.target.value } })} />
        <button onClick={this.handleAdd}>Add</button>
        <button onClick={this.editCourse}>Edit</button>
      </div>

    )
  }
  renderLikedCourses() {
    const { likedCourses } = this.state;
    return (
      <div>
        {likedCourses.length > 0 ? likedCourses.map(likedCourse => <li key={likedCourse.id}>{likedCourse.id} {likedCourse.name} {likedCourse.credit} {likedCourse.subject}</li>) : null}
      </div>
    )
  }
  renderConfirmation() {
    const { likedCourses } = this.state
    const totalLikedCourses = likedCourses.length;
    const totalCreditHours = likedCourses.reduce((a, likedCourse)=> a+Number(likedCourse.credit), 0);
    return (
      <div>
        <div>{`Total number of liked courses: ${totalLikedCourses}`}</div>
        <div>{`Total credit hours of liked courses: ${totalCreditHours}`}</div>
      </div>
    );
  }
  handleEdit(i) {
    this.setState({ editIndex: i });
  }
  editCourse() {
    const { editIndex, courses } = this.state
    const { id, name, credit, subject } = this.state.newAddEditCourse;
    if (editIndex && id.length === 5 && name && credit && subject) {
      const newEditCourse = { id, name, credit, subject };
      let temp = courses.slice();
      temp[editIndex] = newEditCourse;
      this.setState({ courses: temp });
    }
  }
  handleAdd() {
    const { id, name, credit, subject } = this.state.newAddEditCourse;
    if (id.length === 5 && name && credit && subject) {
      const newAddEditCourses = this.state.courses.slice();
      newAddEditCourses.push({ id, name, credit, subject });
      this.setState({ courses: newAddEditCourses });
    }
  }
  handleSearch(text) {
    const { courses } = this.state;
    let searchedCourses = courses.filter((course) => {
      for (let key in course) {
        if (course[key].includes(text)) {
          return true;
        }
      }
      return false;
    });
    this.setState({ searchedCourses });
  }
  handleLike(i) {
    const { likedCourses, courses } = this.state;
    const temp = likedCourses.slice();
    if (!temp.includes(courses[i])) {
      temp.push(courses[i]);
    }
    this.setState({ likedCourses: temp });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.renderSearchBar()}
          {this.state.courses ?
            <ul>
              {this.renderLists(this.state.searchText)}
            </ul> : null}
          {this.renderAddEditForm()}
          {this.renderLikedCourses()}
          {this.renderConfirmation()}
        </header>
      </div>
    );
  }
}

export default App;
