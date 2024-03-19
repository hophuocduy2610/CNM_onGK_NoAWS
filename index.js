const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PORT = 3000;
const app = express();

app.use(express.json({extended: false}));
app.use(express.static('./views'));

app.set('view engine', 'ejs');
app.set('views', './views');


const storage = multer.memoryStorage({
    destination(req, file, callback) {
        callback(null, "");
    }
});
const upload = multer({
    storage,
    limits: {fileSize: 200000},
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = fileType.test(file,mimetype);
    if ( extname) {
        return cb(null, true);
    } return cb("Error: Pls upload images /jpeg|jpg|png|gif/ only !");
}

var cars = [
    {
        maXe: 1,
        tenXe: 'BMW V6',
        loaiXe: 'Siêu xe',
        gia: 30000000,
        hinhXe: "../assets/bmw.jpg"
    },
    {
        maXe: 2,
        tenXe: 'Huyndai 16',
        loaiXe: 'Xe 4 bánh',
        gia: 50000000,
        hinhXe: "../assets/huyndai.jpeg"
    },
    {
        maXe: 3,
        tenXe: 'Toyota B15',
        loaiXe: 'Xe điện',
        gia: 400000000,
        hinhXe: "../assets/toyota4cho.png"
    },
]

app.get('/' , (req , res)=>{
   return res.render('index', {cars})
})

app.post('/save', upload.single("hinhXe") , (req , res)=>{
    const maXe = Number(req.body.maXe);
    const tenXe = req.body.tenXe;
    const loaiXe = req.body.loaiXe;
    const gia = Number(req.body.gia);
    
    const hinhXe = req.file.originalname;
    console.log(hinhXe);
    const filePath = `D:/#CONGNGHEMOI/cnm-onGK-noAWS/views/assets/${maXe}_${Date.now().toString()}_${hinhXe}`;
    fs.writeFile(filePath, req.file.buffer, (err) => {
        console.error(err);
    })
    const fileURL = `../assets/${maXe}_${Date.now().toString()}_${hinhXe}`;

    const params = {
        "maXe": maXe,
        "tenXe": tenXe,
        "loaiXe": loaiXe,
        "gia": gia,
        "hinhXe": fileURL
    }
    cars.push(params);
    return res.redirect("/");
})

app.post('/delete', upload.fields([]) , (req , res)=>{
    const listCheckboxSelected = Object.keys(req.body);
    if(listCheckboxSelected.length <= 0) {
        return res.redirect("/");
    }
    
    function onDeleteItem(length) {
        const maXeCanXoa = Number(listCheckboxSelected[length]);
        cars = cars.filter(car => car.maXe !== maXeCanXoa);
        
        if(length > 0) {
            onDeleteItem(length-1);
        } else return res.redirect("/");
    }
    onDeleteItem(listCheckboxSelected.length - 1);
})

app.post('/xoa', upload.fields([]) , (req , res)=>{
    const maXeCanXoa = Number(req.body.maXe);
    if(!maXeCanXoa) {
        return res.redirect("/");
    }

    cars = cars.filter(car => car.maXe !== maXeCanXoa);
    return res.redirect("/");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})