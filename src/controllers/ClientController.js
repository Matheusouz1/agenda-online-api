const Client = require('../models/Client.models.js')
const authConfig = require("../config/auth.json")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");

//generate token
function generateToken(params = {}){
    return  jwt.sign(params, authConfig.secret, {
        expiresIn:86400,
    })
}

class ClientController {

    async newClient(req, res){
        const { email, whatsapp} = req.body
        try {
        if(await Client.findOne({ email })){
            return res.status(400).send({ error: 'email already exists' });
        }
        if(await Client.findOne({ whatsapp })){
            return res.status(400).send({ error: 'whatsapp already exists' });
        }
        const client = await Client.create(req.body);

        client.password = undefined;

        return res.send({ 
            client, 
            token: generateToken({id: client._id })
        });

        } catch (err){
            console.log(err)
            return res.status(400).send({error:"registration failed"+err});
        }
    };
    

    async login(req, res){
        const {password, email} = req.body
        const client = await Client.findOne({ email }).select('+password +username');
        if(!client){
            return res.status(404).send({error:"client not found"});
        }

        if(!await bcrypt.compare(password, client.password)){
            return res.status(401).send({erro:"Invalid password"});
        }
        client.password = undefined;

        return res.send({ 
            client, 
            token: generateToken({id: client._id })
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

}
module.exports = new ClientController();