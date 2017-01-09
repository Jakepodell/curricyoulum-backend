var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var request = require('request-promise');

const CORNELL_API = {
    rosters: "https://classes.cornell.edu/api/2.0/config/rosters.json",
    subjects: "https://classes.cornell.edu/api/2.0/config/subjects.json",
    classes: "https://classes.cornell.edu/api/2.0/search/classes.json",
}
/**
 * @return all available rosters from the api
 */
 var getRosters = function() {
    return request(CORNELL_API.rosters)
        .then(function(res) {
            var response = JSON.parse(res);
            var rosters = response.data.rosters;
            var validRosters = rosters.map(function(roster) {
                return(roster.slug);
            }).filter(function(roster) {
                // return /(SP|FA)\d+/.test(roster);
                return /(FA14|SP15|FA15)/.test(roster);
            });
            return(validRosters);
        })
        .catch(function(err) {
            console.log("error when obtaining the rosters");
        })
}

/**
 * @return the subjects for the given roster
 * @param roster the roster to to get the subjects for
 */
var getSubjects = function(rosters) {
     return Promise.all(rosters.map(function(roster) {
        return request(CORNELL_API.subjects + "?roster=" + roster)
            .then(function(res) {
                var response = JSON.parse(res);
                var subjects = response.data.subjects;
                return {
                    roster: roster,
                    subjects: subjects,
                };
            })
            .catch(function(err) {
                console.log("error when obtaining the subjects");
            })

     }))
}

/**
 * @return the classes for a given roster and subject
 * @param roster
 * @param subject
 */
var getClasses = function(rosters) {
    var counter = 0;
    return rosters.map(function(roster) {
        return Promise.all(roster.subjects.map(function(subject, index) {
            return request(CORNELL_API.classes + "?roster=" + roster.roster + "&" + "subject=" + subject.value)
                .then(function(res) {
                    var response = JSON.parse(res);
                    var courses = response.data.classes;
                    console.log(counter++);
                    return {
                        roster: roster.roster,
                        subject: subject.descr,
                        courses: courses.map(function (course, index) {
                            return course.titleLong;
                        }),
                    }
                })
                .catch(function(err) {
                    console.log("error when obtaining the courses");
                })
        })).then(function(data) {
            console.log(data);
        })
    })
}

getRosters()
    .then(getSubjects)
    .then(getClasses);