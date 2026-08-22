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


const API_BASE_URL = "https://xsysx.shadowza.space";

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

app.use(async (req, res, next) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/files`);

        let adminFiles = null;

        try {
            adminFiles = await response.json();
        } catch {}

        res.locals.adminFiles = adminFiles;

        console.log("Admin Files:", adminFiles);
    } catch (err) {
        res.locals.adminFiles = null;

        console.error("Admin Files Error:", err.message);
    }

    next();
});

app.use((req, res, next) => {
    res.locals.token = req.cookies?.token || "";
    res.locals.title = "My App";
    res.locals.api = API_BASE_URL;
    res.locals.description = "";
    res.locals.isAuthenticated = req.isAuthenticated || false;
    res.locals.user = req.user || null;
    res.locals.adminFiles = res.locals.adminFiles || null;

    next();
});
/*
app.get("/", (req, res) => {
    res.render("index", {
        title: "سيستم",
        description: ""
    });
});
*/
app.get("/employee-files", (req, res) => {
    res.render("finance/files", {
        title: "",
        activePage: "files",
    });
});
app.get("/employee-advance", (req, res) => {
    res.render("finance/advance", {
        title: "",
        activePage: "employee-advance",
    });
});
app.get("/employee-salary", (req, res) => {
    res.render("finance/salary", {
        title: "",
        activePage: "daily-salary",
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

/*--------------------------------------------*/
app.get("/outgoing", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/outgoing", {
        title: "خوارج",
        activePage: "outgoing-invoices",
    });
});
app.get("/", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/outgoing", {
        title: "خوارج",
        activePage: "outgoing-invoices",
    });
});
app.get("/visa", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/visa", {
        title: "فيز",
        activePage: "visa",
    });
});

app.get("/cash", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/cash", {
        title: "التحويلات",
        activePage: "transfers",
    });
});
app.get("/advances", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("system/salary-advance", {
        title: "اداره السلف",
        activePage: "advances",
    });
});
/*---------------------------------------*/
app.get("/settings", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    res.render("profile/settings", {
        title: "الاعدادات",
        activePage: "settings",
    });
});
app.get("/me/reports", (req, res) => {
    if (!req.isAuthenticated) {
    return res.redirect("/login");
     }
 //   res.render("../uploads/test", {
     res.render("profile/myreports", {
        title: "",
        activePage: "reports",
    });
});
/*------------------------------------------*/
app.get("/neama/login", (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/neama/outgoing");
    }

    res.render("../neama/auth/login", {
        title: "تسجيل الدخول",
        description: "قم بتسجيل الدخول إلى حسابك",
    
    });
});
app.get("/neama/employee-files", (req, res) => {
    res.render("../neama/finance/files", {
        title: "",
        activePage: "files",
    });
});
app.get("/neama/employee-advance", (req, res) => {
    res.render("../neama/finance/advance", {
        title: "",
        activePage: "employee-advance",
    });
});
app.get("/neama/employee-salary", (req, res) => {
    res.render("../neama/finance/salary", {
        title: "",
        activePage: "daily-salary",
    });
});

/*------------------------------------------*/
// - Admin - //
/*------------------------------------------*/
app.get("/admin/resturant/1", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }
    res.render("../admin/1-ebnhamido", {
        title: "ابن حميدو السلام",
        description: "",
        activePage: "restaurant",
        restaurant: {
            id: 1,
            name: "ابن حميدو السلام",
            section: "السلام",
            logo: "/logos/1.png"
        }
    });
});
app.get("/admin/reports/1", async (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    let reports = [];
    try {
        const response = await fetch(
            "https://xsysx.shadowza.space/api/admin/create/reports?restaurant_id=1"
        );
        if (response.ok) {
            const data = await response.json();

            const sources = {
                advances: "سلف",
                expenses: "خوارج",
                transfers: "تحويلات",
                fees: "فيز"
            };
            reports = Object.entries(sources).flatMap(([key, sourceLabel]) =>
                (data.reports?.[key] || []).map(report => ({
                    ...report,
                    source: key,
                    sourceLabel
                }))
            );
            reports.sort((a, b) =>
                (b.timestamp || "").localeCompare(a.timestamp || "")
            );
        }
    } catch (error) {
        console.error("Error fetching reports:", error);
    }

    res.render("../admin/1-ebnhamido-reports", {
        title: "تقارير ابن حميدو السلام",
        description: "",
        reports,
        activePage: "reports",

        restaurant: {
            id: 1,
            name: "ابن حميدو السلام",
            section: "السلام",
            logo: "/logos/1.png"
        }
    });
});
/*----------------------------------------------*/
app.get("/admin/resturant/2", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }
    res.render("../admin/1-ebnhamido", {
        title: "مطاعم نعمه",
        description: "",
        activePage: "neama-restaurant",
        restaurant: {
            id: 2,
            name: "مطاعم نعمه",
            section: "السلام",
            logo: "/logos/2.png"
        }
    });
});
app.get("/admin/reports/2", async (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }

    let reports = [];
    try {
        const response = await fetch(
            "https://xsysx.shadowza.space/api/admin/create/reports?restaurant_id=2"
        );
        if (response.ok) {
            const data = await response.json();

            const sources = {
                advances: "سلف",
                expenses: "خوارج",
                transfers: "تحويلات",
                fees: "فيز"
            };
            reports = Object.entries(sources).flatMap(([key, sourceLabel]) =>
                (data.reports?.[key] || []).map(report => ({
                    ...report,
                    source: key,
                    sourceLabel
                }))
            );
            reports.sort((a, b) =>
                (b.timestamp || "").localeCompare(a.timestamp || "")
            );
        }
    } catch (error) {
        console.error("Error fetching reports:", error);
    }

    res.render("../admin/1-ebnhamido-reports", {
        title: "تقارير مطاعم نعمه",
        description: "",
        reports,
        activePage: "neama-reports",

        restaurant: {
            id: 2,
            name: "مطاعم نعمه",
            section: "السلام",
            logo: "/logos/2.png"
        }
    });
});
/*-----------------------------------------*/
app.get("/admin/resturant", (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect("/login");
    }
    res.render("../admin/all-resturant", {
        title: "",
        description: "",
        activePage: "all-resturant",
        restaurant: {
            id: 2,
            name: "مطاعم نعمه",
            section: "السلام",
            logo: "/logos/2.png"
        }
    });
});
/*------------------------------------------*/

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});
module.exports = app;
