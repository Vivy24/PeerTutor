const pool = require("./config").pool;

// get queries
exports.getTutor = async () => {
    let users = [];
    let tutor = "Tutor";

    await pool.query("Select id,email,name,role,department,subject FROM users WHERE role = $1", [tutor]).then((res) => (users = res.rows)).catch((e) => {
        throw e;
    });

    return users;
};

exports.getTutorsByDepartmentAndSubject = async (department, subject) => {
    let users = [];

    await pool.query("Select id,email,name,role,department,subject FROM users WHERE department = $1 AND subject = $2", [department, subject]).then((res) => {
        users = res.rows;
    }).catch((e) => {
        throw e;
    });

    return users;
};

exports.getUserByID = async (id) => {
    const parsedId = parseInt(id);
    let user = {};
    await pool.query("SELECT id,email,name,role,department,subject FROM users WHERE id = $1", [parsedId]).then((res) => (user = res.rows[0])).catch((e) => {
        throw e;
    });
    return user;
};

exports.getUserByEmail = async (email) => {
    let user = {};
    await pool.query("SELECT email,name,role,department,subject,id FROM users WHERE email = $1", [email]).then((res) => {
        user = res.rows[0];
    }).catch((e) => {
        throw e;
    });

    return user;
};

exports.getUserForResetPassword = async (email) => {
    let user = {};
    await pool.query("SELECT email,id,password, name FROM users WHERE email = $1", [email,]).then((res) => (user = res.rows[0])).catch((e) => {
        throw e;
    });
    return user;
};

exports.getUserForResetPasswordById = async (id) => {
    let user = {};
    await pool.query("SELECT id,password,name FROM users WHERE id = $1", [id]).then((res) => (user = res.rows[0])).catch((e) => {
        throw e;
    });

    console.log(user);
    return user;
};

exports.changePassword = async (password, userID) => {
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [password, userID]).catch((e) => {
        throw e;
    });
};

exports.promoteToTutor = async (requesterID, subject, department) => {
    await pool.query("UPDATE users SET role = 'Tutor', department = $1, subject=$2 WHERE id=$3 RETURNING id", [department, subject, requesterID]).then((res) => {
        return res.id;
    }).catch((e) => {
        throw e;
    });
};

exports.demoteAdmin = async (requesterID) => {
    await pool.query("UPDATE users SET role = 'Student' WHERE id=$1", [requesterID]).then((res) => {
        return res;
    }).catch((e) => {
        throw e;
    });
};

exports.promoteToAdmin = async (requesterID) => {
    await pool.query("UPDATE users SET role = 'Admin' WHERE id=$1", [requesterID]).then((res) => {
        return res;
    }).catch((e) => {
        throw e;
    });
};

exports.changeStatusRequest = async (reqID) => {
    await pool.query("UPDATE tutorRequest SET status = 'Approved' WHERE id=$1 RETURNING id", [reqID]).then((res) => {
        return res.rows[0].id;
    }).catch((e) => {
        throw e;
    });
};

exports.loggin = async (email) => {
    let user = {};
    await pool.query("SELECT email,password,id FROM users WHERE email = $1", [email]).then((res) => (user = res.rows[0])).catch((e) => {
        throw e;
    });
    return user;
};

exports.getPendingReqs = async () => {
    let requests = [];
    const status = "Pending";

    await pool.query("SELECT tutorRequest.id, tutorRequest.requesterID, tutorRequest.subject, tutorRequest.department, tutorRequest.status, email FROM tutorRequest JOIN users ON tutorRequest.requesterID = users.id WHERE status = $1", [status]).then((res) => (requests = res.rows)).catch((e) => {
        throw e;
    });

    return requests;
};

exports.getRequestByID = async (requestID) => {
    let request = {};
    await pool.query("SELECT id, requesterID, subject, department, status FROM tutorRequest WHERE id=$1", [requestID]).then((res) => (request = res.rows[0])).catch((e) => {
        throw e;
    });

    return request;
};

exports.deleteRequestByID = async (requestID) => {
    await pool.query("DELETE FROM tutorRequest WHERE id=$1 RETURNING id", [requestID]).then((res) => {
        return res.rows[0].id;
    }).catch((e) => {
        throw e;
    });
};

exports.clearTutor = async (tutorID) => {
    await pool.query("UPDATE users SET department = null, subject = null, role = 'Student' WHERE id = $1", [tutorID]).catch((e) => {
        throw e;
    });
};

exports.getMeetingByTutor = async (tutorID) => {
    let meetings = [];
    await pool.query("SELECT meetings.date, meetings.id, meetings.status ,users.name, users.email FROM meetings JOIN users ON meetings.studentID = users.id WHERE tutorID = $1 ORDER BY meetings.date, meetings.status", [tutorID]).then((res) => {
        meetings = res.rows;
    }).catch((e) => {
        throw e;
    });
    return meetings;
};

exports.getMeetingByStudent = async (studentID) => {
    let meetings = [];
    await pool.query("SELECT meetings.date, meetings.id, users.name, users.email ,users.department, users.subject, meetings.status FROM meetings JOIN users ON meetings.tutorID = users.id WHERE studentID = $1 AND meetings.status = $2 AND meetings.date >='today' ORDER BY meetings.date", [studentID, "Booked"]).then((res) => {
        meetings = res.rows;
    }).catch((e) => {
        throw e;
    });

    return meetings;
};

exports.getAllPendingMeetings = async (tutorID) => {
    let meetings;
    await pool.query("SELECT * FROM meetings WHERE status = 'Booked' AND date >='today' AND tutorID = $1", [tutorID]).then((res) => {
        meetings = res.rows;
    }).catch((e) => {
        throw e;
    });

    return meetings;
};

exports.getAMeeting = async (meetingID) => {
    let meeting;
    await pool.query("SELECT * FROM meetings WHERE id = $1", [meetingID]).then((res) => {
        meeting = res.rows[0];
    }).catch((e) => {
        throw e;
    });

    return meeting;
};

exports.getMeetingByDateAndTutor = async (tutorID, date) => {
    let meeting;
    await pool.query("SELECT * FROM meetings WHERE date = $1 AND tutorID = $2", [date, tutorID,]).then((res) => {
        meeting = res.rows[0];
    }).catch((e) => {
        throw e;
    });

    return meeting;
};

exports.deleteMeeting = async (meetingID) => {
    await pool.query("UPDATE meetings SET status='Deleted' WHERE id=$1 AND status = 'Booked'", [meetingID]).then((res) => {
        return res.rows;
    }).catch((e) => {
        throw e;
    });
};

exports.finishMeeting = async (meetingID) => {
    await pool.query("UPDATE meetings SET status='Finished' WHERE id=$1 AND status = 'Booked'", [meetingID]).then((res) => {
        return res.rows;
    }).catch((e) => {
        throw e;
    });
};

exports.createAMeeting = async (date, tutorID, studentID, status) => {
    let res;

    await pool.query("INSERT INTO meetings (date,tutorID,studentID,status) VALUES ($1,$2,$3,$4) RETURNING id ", [date, tutorID, studentID, status]).then((result) => {
        res = result.rows[0].id;
    }).catch((e) => {
        throw e;
    });
};

exports.getReviewByTutorID = async (tutorID) => {
    let results = [];
    await pool.query("SELECT reviews.timestamp, reviews.content, reviews.rating, users.name, users.email  FROM reviews JOIN users ON reviews.reviewerID = users.id WHERE reviews.tutorID = $1 ORDER BY reviews.timestamp DESC", [tutorID]).then((res) => {
        results = res.rows;
    }).catch((e) => {
        throw e;
    });
    return results;
};

exports.getAllUser = async () => {
    let results = [];

    await pool.query("SELECT email FROM users").then((res) => {
        results = res.rows;
    }).catch((e) => {
        throw e;
    });
    return results;
};

exports.createReview = async (tutorID, reviewerID, content, rating) => {
    let result;
    await pool.query("INSERT INTO reviews (tutorID, reviewerID, content, rating) VALUES ($1,$2,$3,$4) RETURNING id ", [tutorID, reviewerID, content, rating]).then((res) => {
        result = res.rows[0].id;
    }).catch((e) => {
        throw e;
    });

    return result;
};
