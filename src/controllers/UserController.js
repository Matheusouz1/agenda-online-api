const User = require("../models/User.models.js");
const authConfig = require("../config/auth.json")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const { default: axios } = require("axios");



//generate token
function generateToken(params = {}){
    return  jwt.sign(params, authConfig.secret, {
        expiresIn:86400,
    })
}

class UserController {

    async store(req, res){
        const {username, company_name, company_link, whatsapp} = req.body
        try {
        if(await User.findOne({ username })){
            console.log(await User)
            return res.status(400).send({ error: 'User already exists' });
        }
        if(await User.findOne({ company_name })){
            return res.status(400).send({ error: 'company name already exists' });
        }
        if(await User.findOne({ company_link })){
            return res.status(400).send({ error: 'company Link already exists' });
        }
        if(await User.findOne({ whatsapp })){
            return res.status(400).send({ error: 'whatsapp already exists' });
        }
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToken({id: user._id })
        });

        } catch (err){
            return res.status(400).send({error:"registration failed"+err});
        }
    };

    async login(req, res){
        const {password, username} = req.body
        const user = await User.findOne({ username }).select('+password +username');
        if(!user){
            return res.status(404).send({error:"User not found"});
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(401).send({erro:"Invalid password"});
        }
        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToken({id: user._id })
        });
    }

    async update(req, res){
        try{
            const link = req.params.userLink;
            const {password} = req.body; 
            if(password){
                return res.status(404).send({error:"campo password não permitido nessa requisição"});
            }
            const user = await User.findOne({company_link:link});
            if(String(user._id)!==String(req.userId)){
                return res.status(404).send({error:"permissão imválida! Token inválido"});
            }
            await User.updateOne({company_link:link}, req.body);
            return res.send({ok:true})
        }catch(err){
            return res.status(400).send({error:"update failed"+err});
        }
    }
    async updatePass(req, res){
        try{
            const link = req.params.userLink;
            const {oldpassword} = req.body; 
            const {newpassword} = req.body;
            if(!oldpassword){
                return res.status(404).send({error:"campo oldpassword obrigatório"});
            }
            if(!newpassword){
                return res.status(404).send({error:"campo newpassword obrigatório"});
            }
            if(newpassword==oldpassword){
                return res.status(404).send({error:"as senhas estão iguais"});
            }

            const user = await User.findOne({company_link:link}).select('+password');
            if(String(user._id)!==String(req.userId)){
                return res.status(404).send({error:"permissão imválida! Token inválido"});
            }
            if(!await bcrypt.compare(oldpassword, user.password)){
                return res.status(401).send({erro:"Invalid password"});
            }
            const hash = await bcrypt.hash(newpassword, 10);

            await User.updateOne({company_link:link}, {
                password:hash
            });
            return res.send({ok:"senha alterada!"})
        }catch(err){
            return res.status(400).send({error:"update failed"+err});
        }
    }

    async newpassword(){
        
    }

    async delete(req, res){
        let user = req.params.userLink 
        await User.remove({store_link:user})
        res.send('user deleted!')
    }

    async list(req, res){
        res.send(await User.find());
    }
    async listOne(req, res){
        try{
            let link = req.params.company_link;
            const user = await User.findOne({company_link:link});
            if(!user){
                return res.status(400).send({ error: 'user not found' });
            }
            return res.send(user)
        }catch(err){
            return res.status(400).send({error:"update failed"+err});
        }
    }
    
    async listOneid(req, res){
        try{
            let id = req.params.userid;
            const user = await User.findOne({_id:id});
            if(!user){
                return res.status(400).send({ error: 'user not found' });
            }
            return res.send(user)
        }catch(err){
            return res.status(400).send({error:"update failed"+err});
        }
    }

    async admin(req, res){
        const userId = req.userId;
        try{
            const user = await User.findById(userId).select('+username');
            return res.send(user)
        }catch(err){
            return res.status(400).send({error:"update failed"+err});
        }
    }

}
module.exports = new UserController();