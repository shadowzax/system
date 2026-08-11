const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 2027;
const HOST = 'localhost';

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "frontend"));

// const API_BASE_URL = "http://108.181.221.18:7023";

// app.use(cookieParser());

// (async () => {
//     const response = await fetch("http://108.181.221.18:7023/api/courses/1");
//     const data = await response.json();
//     console.log(data);
// })();

// app.use(async (req, res, next) => {
//     const token = req.cookies.session;
//     if (!token) {
//         req.isAuthenticated = false;
//         req.user = null;
//     } else {
//         try {
//             const response = await fetch(`${API_BASE_URL}/api/auth/check-token`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ token })
//             });

//             const data = await response.json();

//             if (data.success) {
//                 req.isAuthenticated = true;
//                 req.user = data.user;
//             } else {
//                 req.isAuthenticated = false;
//                 req.user = null;
//             }
//         } catch (err) {
//             req.isAuthenticated = false;
//             req.user = null;
//         }
//     }

//     next();
// });

// app.use((req, res, next) => {
//     res.locals.title = "My App";
//     res.locals.api = API_BASE_URL;
//     res.locals.description = "";
//     res.locals.isAuthenticated = req.isAuthenticated;
//     res.locals.user = req.user;

//     next();
// });
app.get("/", (req, res) => {
    res.render("index", {
        title: "سيستم",
        description: ""
    });
});

/*-----------------------------------------*/
app.get("/outgoing", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("system/outgoing", {
        title: "خوارج",
        description: ""
    });
});
app.get("/visa", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("system/visa", {
        title: "فيز",
        description: ""
    });
});
app.get("/cash", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("system/cash", {
        title: "تحويلات كاش",
        description: ""
    });
});
app.get("/advances", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("system/salary-advance", {
        title: "تحويلات كاش",
        description: ""
    });
});
app.get("/settings", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("settings/settings", {
        title: "تحويلات كاش",
        description: ""
    });
}); 
app.get("/activity", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("settings/activity", {
        title: "تحويلات كاش",
        description: ""
    });
}); 
app.get("/payments", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("settings/payments", {
        title: "تحويلات كاش",
        description: ""
    });
}); 
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});
module.exports = app;
