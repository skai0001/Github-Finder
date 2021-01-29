import React, {Fragment, Component} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import About from "./components/pages/About";

import Navbar from "./components/layout/Navbar";
import UserItem from "./components/users/UserItem";
import Users from "./components/users/Users";
import axios from 'axios';
import './App.css';
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import User from "./components/users/User";

class App extends Component {
    state = {
        users: [],
        user: {},
        repos:[],
        loading: false,
        alert: null
    }

    /* async componentDidMount() {
         //console.log(process.env.REACT_APP_GITHUB_CLIENT_SECRET)
         this.setState({loading: true});
         const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
         console.log(res.data);
         this.setState({users: res.data, loading: false})
     }
 */
    // search for users
    searchUsers = async text => {
        this.setState({loading: true})
        console.log('inside searchUsers', text);
        const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        this.setState({users: res.data.items, loading: false})

    }

    //Get single Github user
    getUser = async (username) => {
        const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        this.setState({user: res.data, loading: false})
    }

    //get users repos
    getUserRepos = async (username) => {
        const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        this.setState({repos: res.data, loading: false})
    }


    //clear users state
    clearUsers = () => this.setState({users: [], loading: false})

    setAlert = (msg, type) => {
        this.setState({alert: {msg, type}})
        setTimeout(() => this.setState({alert: null}), 5000);
    }


    render() {
        const {users, loading, user, repos} = this.state;

        return (
            <Router>
                <Fragment>
                    <Navbar/>
                    <div className='container'>
                        <Alert alert={this.state.alert}/>
                        <Switch>
                            <Route exact path='/' render={props => (
                                <Fragment>
                                    <Search
                                        searchUsers={this.searchUsers}
                                        clearUsers={this.clearUsers}
                                        showClear={users.length > 0 ? true : false}
                                        setAlert={this.setAlert}/>
                                    <Users loading={loading} users={users}/>

                                </Fragment>
                            )}
                            />
                            <Route exact path='/about' component={About}/>
                            <Route exact path='/user/:login' render={props => (
                                <User
                                    {...props}
                                    getUser={this.getUser}
                                    getUserRepos={this.getUserRepos}
                                    user={user}
                                    repos={repos}
                                    loading={loading}
                                />
                            )}
                            />
                        </Switch>
                    </div>
                </Fragment>
            </Router>
        )
    }
}

export default App;
