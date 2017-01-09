var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var request = require('request-promise');
var fs = require('fs');

var semester = process.argv[2];
console.log(semester);

const CORNELL_API = {
    subjects: "https://classes.cornell.edu/api/2.0/config/subjects.json",
    classes: "https://classes.cornell.edu/api/2.0/search/classes.json",
}

function pad(width, string, padding) {
    return (width <= string.length) ? string : pad(width, padding + string, padding)
}

fs.writeFile(semester + '.txt', "=============== " + semester + "===============\n____________________________________________________\n", function (err) {
    if (err)
        return console.log(err);
});

request(CORNELL_API.subjects + "?roster=" + semester, {json: true})
            .then(function(res) {
                var subjects = res.data.subjects;
                subjects.map(function (subject) {
                    request(CORNELL_API.classes + "?roster=" + semester + "&" + "subject=" + subject.value, {json: true})
                        .then(function (res) {
                            var courses = res.data.classes;
                            var classes = {
                                roster: semester,
                                subject: subject.descr,
                                courses: courses.map(function (course, index) {
                                    fs.appendFile(semester + '.txt'," | " +pad(8, subject.value, " ") + " | " + pad(40, course.titleShort, " ") + "|\n_______________________________________________________\n", function (err) {
                                        if (err)
                                            return console.log(err);
                                    });
                                    return course.titleLong;
                                }),
                            };
                        })
                })
            })
            .catch(function(err) {
                console.log("error when obtaining the subjects");
            })

/**
 * @return the classes for a given roster and subject
 * @param roster
 * @param subject
 */
// var getClasses = function(rosters) {
//     console.log(rosters)
//     // return rosters.map(function(roster) {
//     //     return Promise.all(roster.subjects.map(function(subject) {
//     //         return request(CORNELL_API.classes + "?roster=" + roster.roster + "&" + "subject=" + subject.value)
//     //             .then(function(res) {
//     //                 var courses = res.data.classes;
//     //                 return {
//     //                     roster: roster.roster,
//     //                     subject: subject.descr,
//     //                     courses: courses.map(function (course, index) {
//     //                         return course.titleLong;
//     //                     }),
//     //                 }
//     //             })
//     //             .catch(function(err) {
//     //                 console.log(err);
//     //             })
//     //     })).then(function(data) {
//     //         console.log(data);
//     //     })
//     // })
// }

// getSubjects(semester)
    // .then(getClasses);