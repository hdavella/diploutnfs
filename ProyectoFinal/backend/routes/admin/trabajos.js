var express = require('express');
var router = express.Router();
var trabajosModel = require('../../models/trabajosModel')

router.get('/', async (req, res, next) =>{
    var trabajos = await trabajosModel.getTrabajos();
    res.render('admin/trabajos',
        {
            layout: 'admin/layout',
            nombre: req.session.nombre,
            trabajos
        }
    );
});

router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout:'admin/layout'
    });
});

router.get('/eliminarconfirm/:id', (req, res, next) => {
    var id = req.params.id
    //console.log(id);
    res.render('admin/eliminarconfirm', {
        layout:'admin/layout',
        id
    });
});

router.get('/modificar/:id', async (req, res, next) => {
    let id = req.params.id;
    let trabajo = await trabajosModel.selectTrabajoById(id);
    res.render('admin/modificar',
        {
            layout: 'admin/layout',
            trabajo
        }
    );
});

router.post('/eliminar', async (req, res, next) =>{
    try{
        var id=req.body.idconfirmar;
        //console.log(`trabajo a borrar ${id}`)
        await trabajosModel.deleteTrabajoById(id);
        res.redirect('/admin/trabajos');

    }catch{
        console.log(error);
    }
});

router.post('/agregar', async (req, res, next)=>{
    try{
        if(req.body.titulo != "" && req.body.subtitulo != "" && req.body.descripcion != ""){
            await trabajosModel.altaTrabajo(req.body);
            console.log(req.body);
            res.redirect('/admin/trabajos')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error:true,
                message: 'Todos los campos son requeridos'
            })
        }
    }catch{
        console.log(error);
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error:true,
            message: 'No se cargo el trabajo'
        })
    }
});

router.post('/modificar', async (req, res, next)=>{
    try{
        let obj = {
            titulo:req.body.titulo,
            subtitulo:req.body.subtitulo,
            descripcion:req.body.descripcion
        }
        await trabajosModel.updateTrabajoById(obj, req.body.id);
        res.redirect('/admin/trabajos');
    }catch{
        console.log(error);
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error:true,
            message: 'No se modificó el trabajo'
        })
    }
})

module.exports = router;