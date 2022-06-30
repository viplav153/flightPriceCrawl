const express =require('express')


const app=express();



app.get('/',(req,res)=>res.send("server started"));

//Database
const db=require('./config/database');
// Test DB
db.authenticate()//return promise
  .then(()=>console.log('Database connected...'))
  .catch(err =>console.log('Error: '+ err) )

//adding table
const Flight=require('./models/Flight')
// Script  code   Area 
//___________________________________________________________________________________________________

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { map } = require('cheerio/lib/api/traversing');

///configuring browser
let flag1=0;
let browser;
async function configureBrowser(scrape_date,src,dest) {
    flag1=0
    const url = 'https://paytm.com/flights/flightSearch/'+src+'/'+dest+'/1/0/0/E/'+scrape_date; 
    //const url='https://paytm.com/flights/flightSearch/DEL-Delhi/BLR-Bengaluru/1/0/0/E/2021-10-13'
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

//check if certain class is visible
//const elemSelector='#app > div > div._1HKZ > div > div > div > div.row._9m9Z > div > div._2JLq > div'
const isElementVisible = async (page, btnClass) => {
    let visible = true;
    await page.waitForSelector(btnClass, { visible: true, timeout: 15000 })
        .catch(() => {
            visible = false;
        });
    return visible;
};
let Air=new Map;
let ind=new Map;
//scrape  the price fuction
async function checkPrice(page,scrape_date) {
   
    let html = await page.evaluate(() => document.body.innerHTML);
    const btnClass = '._2TFk';
    const elemSelector='#app > div > div._1HKZ > div > div > div > div.row._9m9Z > div > div._2JLq > div._2TFk'
   
    if(await isElementVisible(page,btnClass))
    {
        const $ = cheerio.load(html)

        let tim=[10,17]
        for(let k=0;k<2;k++)//iterating 2 times 1 for 10 am and one for 17:00or 5 pm
        {
            let ma =  new Map();
            let check=0
            $(elemSelector).each((parentIdx,parentElem)=>
           {

                    let price=0
                    let flight_name=""
                    let flag=0
                    let hour=0
                    $(parentElem).children().children().each((childIdx,childElem)=>
                    {
                        
                        if(childIdx==1)
                        {
                            let a=""
                        
                            $(childElem).children().children().each((grandChldIdx,grandChldElem)=>
                            {
                            if(grandChldIdx==0)
                            {
                                a= ($(grandChldElem).text())
                            }
                            })
                        
                            flight_name=a
                            check=1
                            
                            
                        }
                        else if(childIdx==7)
                        {
                            let a=  $(childElem).text()
                            a=a.toString()
                            let tex=""
                            for (let i = 0; i < a.length; i++) {
                                if(a[i]!=',')
                                {
                                    tex += a[i];
                                }
                                else
                                {
                                    continue
                                }
                            
                            }
                            price=parseInt(tex)
                            
        
                        }
                        else if(childIdx==5)
                        {
                            let a=  $(childElem).text()
                            a=a.toString()
                            let n=a.length
        
                            if(a[n-1]=='p')
                            {
                                flag=1
                            }
        
                        }
                        else if(childIdx==2)
                        {
                            let a=  $(childElem).text()
                            let hr=""
                            hr=a[0]+a[1]
                            minute=a[3]+a[4];
                            hour=parseInt(hr)
                        }
                        
            
                    })
                    if(flag==1 && (flight_name=="Air India " || flight_name=="IndiGo ") && Math.abs(hour-tim[k])<=1)
                    {
                      
                        if(ma.has(flight_name)==true)
                        {
                            let temp= ma.get(flight_name)   
                            temp=Math.min(temp,price)
                            ma.set(flight_name,temp)
                        }
                        else
                        {
                            ma.set(flight_name,price);
                        }
        
                    }
                
                
            })
            if(ma.size==0 &&check==0)
            {
                flag1=1
                console.log("Scraping failed retrying...")
            }
            else
            {
               
               
                if(ma.has("Air India ")==true)
                {
                    let a=scrape_date+(tim[k].toString());
                    
                    Air.set(a,ma.get('Air India '))
                }
                if(ma.has("IndiGo ")==true)
                {
                    let a=scrape_date+tim[k].toString();
                    ind.set(a,ma.get('IndiGo '))
                }
               
                
            }
        
        } 
       

    }
    else
    {
        flag1=1
        console.log("Scraping failed retrying..")
    }
    await page.close();

        
}


async function startTracking(scrape_date,src,dest) {
    const page = await configureBrowser(scrape_date,src,dest);
    
    await checkPrice(page,scrape_date)
}


//date maker  fuction

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

// Add 7 Days
async function date_maker(ahead)
{
    const date =new Date();
    let new_date= await date.addDays(ahead);
    let day=await new_date.getDate();
    let month=await new_date.getMonth();
    let year=await new_date.getFullYear();

    let s="";
    month=month+1;
    if(month<10 && day<10)
    {
        s= await year.toString()+"-"+"0"+month.toString()+"-"+"0"+day.toString();
    }
    else if(month<10)
    {
        s=await year.toString()+"-"+"0"+month.toString()+"-"+day.toString();
    }
    else if(day<10)
    {
        s= await year.toString()+"-"+month.toString()+"-"+"0"+day.toString();
    }
    else
    {
        s=await year.toString()+"-"+month.toString()+"-"+day.toString();
    }
    
    return s

}




async function total(){
    browser = await puppeteer.launch();
    
    let a=[1,7,30]
    let routes=[["BOM-Mumbai","DEL-Delhi"],["DEL-Delhi","BOM-Mumbai"],["BLR-Bengaluru","DEL-Delhi"],["DEL-Delhi","BLR-Bengaluru"],["DEL-Delhi","GOI-Goa"],["GOI-Goa","DEL-Delhi"],["MAA-Chennai","DEL-Delhi"],["DEL-Delhi","MAA-Chennai"],["BLR-Bengaluru","BOM-Mumbai"],["BOM-Mumbai","BLR-Bengaluru"]]
    for(let j=0;j<10;j++)
    {
        console.log(routes[j][0]+" to "+routes[j][1])
        let indigo=new Map
        let AirIndia=new Map
        for(let i=0 ;i<3;i++)
        {
            let s=await date_maker(a[i]);
            await startTracking(s,routes[j][0],routes[j][1]);
            if(flag1==1)
            {
                i=i-1; 
            }
            else
            {
                //route ,name,date
                console.log(s)

                //indigo
                if(ind.has(s+"10")==true && i==0)
                {
                    indigo.set("one_day_ahead_10am",ind.get(s+"10"))
                }
                if(ind.has(s+"17")==true && i==0)
                {
                    indigo.set("one_day_ahead_5pm",ind.get(s+"17"))
                }
                if(ind.has(s+"10")==true && i==1)
                {
                    indigo.set("one_week_ahead_10am",ind.get(s+"10"))
                }
                if(ind.has(s+"17")==true && i==1)
                {
                    indigo.set("one_week_ahead_5pm",ind.get(s+"17"))
                }
                if(ind.has(s+"10")==true && i==2)
                {
                    indigo.set("one_month_ahead_10am",ind.get(s+"10"))
                }
                if(ind.has(s+"17")==true && i==2)
                {
                    indigo.set("one_month_ahead_5pm",ind.get(s+"17"))
                }

                // Airindia
                if(Air.has(s+"10")==true && i==0)
                {
                    AirIndia.set("one_day_ahead_10am",Air.get(s+"10"))
                }
                if(Air.has(s+"17")==true && i==0)
                {
                    AirIndia.set("one_day_ahead_5pm",Air.get(s+"17"))
                }
                if(Air.has(s+"10")==true && i==1)
                {
                    AirIndia.set("one_week_ahead_10am",Air.get(s+"10"))
                }
                if(Air.has(s+"17")==true && i==1)
                {
                    AirIndia.set("one_week_ahead_5pm",Air.get(s+"17"))
                }
                if(Air.has(s+"10")==true && i==2)
                {
                    AirIndia.set("one_month_ahead_10am",Air.get(s+"10"))
                }
                if(Air.has(s+"17")==true && i==2)
                {
                    AirIndia.set("one_month_ahead_5pm",Air.get(s+"17"))
                }

                ind.clear();
                Air.clear();
            }

        }
        //saving in Data base    _ _ _
        if(AirIndia.size!=0)
        {
          const date =(new Date()).toString();
          let one_day10=null
          let one_day5=null
          let one_week10=null
          let one_week5=null
          let one_month10=null
          let one_month5=null
          if(AirIndia.has("one_day_ahead_10am")==true)
          {
             one_day10=AirIndia.get("one_day_ahead_10am")
          }
          if(AirIndia.has("one_day_ahead_5pm")==true)
          {
             one_day5=AirIndia.get("one_day_ahead_5pm")
          }
          if(AirIndia.has("one_week_ahead_10am")==true)
          {
             one_week10=AirIndia.get("one_week_ahead_10am")
          }
          if(AirIndia.has("one_week_ahead_5pm")==true)
          {
             one_week5=AirIndia.get("one_week_ahead_5pm")
          }
          if(AirIndia.has("one_month_ahead_10am")==true)
          {
             one_month10=AirIndia.get("one_month_ahead_10am")
          }
          if(AirIndia.has("one_month_ahead_5pm")==true)
          {
             one_month5=AirIndia.get("one_month_ahead_5pm")
          }

         //.sync({force:true})
           db
           .sync()
           .then((result)=>{
               Flight.create({ airline_name:"AirIndia ",source:routes[j][0],destination:routes[j][1], job_run_date:date, one_day_ahead_10am:one_day10, one_day_ahead_5pm:one_day5, one_week_ahead_10am:one_week10, one_week_ahead_5pm :one_week5, one_month_ahead_10am:one_month10, one_month_ahead_5pm:one_month5});
               console.log(result);
           }).then(flight=>{
               console.log("Flight inserted",flight);
           })
           .catch((err)=>{
               console.log(err);
           })



            console.log(AirIndia)
        }

        if(indigo.size!=0)
        {

             const date =(new Date()).toString();
             let one_day10=null
             let one_day5=null
             let one_week10=null
             let one_week5=null
             let one_month10=null
             let one_month5=null

             if(indigo.has("one_day_ahead_10am")==true)
             {
                one_day10=indigo.get("one_day_ahead_10am")
             }
             if(indigo.has("one_day_ahead_5pm")==true)
             {
                one_day5=indigo.get("one_day_ahead_5pm")
             }
             if(indigo.has("one_week_ahead_10am")==true)
             {
                one_week10=indigo.get("one_week_ahead_10am")
             }
             if(indigo.has("one_week_ahead_5pm")==true)
             {
                one_week5=indigo.get("one_week_ahead_5pm")
             }
             if(indigo.has("one_month_ahead_10am")==true)
             {
                one_month10=indigo.get("one_month_ahead_10am")
             }
             if(indigo.has("one_month_ahead_5pm")==true)
             {
                one_month5=indigo.get("one_month_ahead_5pm")
             }

            //.sync({force:true})
              db
              .sync()
              .then((result)=>{
                  Flight.create({ airline_name:"Indigo ",source:routes[j][0],destination:routes[j][1], job_run_date:date, one_day_ahead_10am:one_day10, one_day_ahead_5pm:one_day5, one_week_ahead_10am:one_week10, one_week_ahead_5pm :one_week5, one_month_ahead_10am:one_month10, one_month_ahead_5pm:one_month5});
                  console.log(result);
              }).then(flight=>{
                  console.log("Flight inserted",flight);
              })
              .catch((err)=>{
                  console.log(err);
              })

          
          console.log(indigo)
        }
       

        console.log("------------------------")

    }
    
    await browser.close();
   
}

total()



////script end___________________________________________________________________





const PORT =process.env.PORT ||5000;

app.listen(PORT,console.log(`server started on port ${PORT}`));



