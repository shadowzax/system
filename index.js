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

const API_BASE_URL = "http://108.181.221.18:7049";

app.use(cookieParser());


app.use(async (req, res, next) => {
    const token = req.cookies?.token;

    console.log("========== AUTH CHECK ==========");
    console.log("URL:", req.originalUrl);
    console.log("Token:", token ? "موجود" : "غير موجود");

    req.isAuthenticated = false;
    req.user = null;

    if (!token) {
        console.log("Authentication: غير مسجل دخول");
        console.log("================================");

        return next();
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        });

        console.log("API Status:", response.status);

        let data;

        try {
            data = await response.json();
        } catch (error) {
            data = {
                success: false,
                message: "استجابة غير صالحة من API"
            };
        }

        console.log("API Response:", data);

        if (response.ok && data.success === true) {
            req.isAuthenticated = true;
            req.user = data.user || null;

            console.log("Authentication: ناجح");
            console.log("User:", req.user);
        } else {
            req.isAuthenticated = false;
            req.user = null;

            console.log("Authentication: فاشل");
            console.log("Message:", data.message || "التوكن غير صالح");
        }
    } catch (err) {
        req.isAuthenticated = false;
        req.user = null;

        console.error("Auth Check Error:", err.message);
    }

    console.log("================================");

    next();
});

app.use((req, res, next) => {
    res.locals.title = "My App";
    res.locals.api = API_BASE_URL;
    res.locals.description = "";
    res.locals.isAuthenticated = req.isAuthenticated;
    res.locals.user = req.user;

    next();
});
app.get("/", (req, res) => {
    res.render("index", {
        title: "سيستم",
        description: ""
    });
});
app.get("/login", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/");
    }

    res.render("auth/login", {
        title: "تسجيل الدخول",
        description: "قم بتسجيل الدخول إلى حسابك"
    });
});
app.get("/admin/acount", (req, res) => {
    // if (!req.isAuthenticated) {
    //     return res.redirect("/login");
    // }

    res.render("mangment/acount", {
        title: "",
        description: ""
    });
});

/*-----------------------------------------*/
app.get("/outgoing", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/outgoing", {
        title: "خوارج",
        description: ""
    });
});

app.get("/visa", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/visa", {
        title: "فيز",
        description: ""
    });
});

app.get("/cash", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/cash", {
        title: "تحويلات كاش",
        description: ""
    });
});
app.get("/advances", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/salary-advance", {
        title: "تحويلات كاش",
        description: ""
    });
});
app.get("/settings", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("settings/settings", {
        title: "تحويلات كاش",
        description: ""
    });
});

app.get("/activity", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("settings/activity", {
        title: "تحويلات كاش",
        description: ""
    });
});

app.get("/payments", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
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
