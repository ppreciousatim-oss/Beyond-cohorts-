/* =========================
   WEEKLY ENGAGEMENT CHART
========================= */

const engagementChart =
document.getElementById(
"engagementChart"
);

new Chart(
engagementChart,
{
    type:"line",

    data:{
        labels:[
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ],

        datasets:[{
            label:"Engagement",

            data:[
              40,
              55,
              70,
              65,
              80,
              75,
              90
            ],

            borderColor:"#2d2dff",

            backgroundColor:
            "rgba(45,45,255,0.2)",

            fill:true,

            tension:0.4
        }]
    }
});

const bars =
document.querySelectorAll(".bar span");

bars.forEach((bar)=>{

    let finalHeight =
    bar.style.height;

    bar.style.height = "0";

    setTimeout(()=>{

        bar.style.height =
        finalHeight;

    },200);

});
/* =========================
   REPLY MODAL
========================= */

const replyButtons =
document.querySelectorAll(
".reply-btn"
);

const replyModal =
document.getElementById(
"replyModal"
);

const closeModal =
document.getElementById(
"closeModal"
);

const sendReply =
document.getElementById(
"sendReply"
);

const replyText =
document.getElementById(
"replyText"
);



replyButtons.forEach((button)=>{

    button.addEventListener(
    "click",
    function(){

        replyModal.style.display =
        "flex";

    });

});



closeModal.addEventListener(
"click",
function(){

    replyModal.style.display =
    "none";

});



sendReply.addEventListener(
"click",
function(){

    if(replyText.value === ""){

        alert(
          "Type a reply first"
        );

    }

    else{

        alert(
          "Reply Sent"
        );

        replyModal.style.display =
        "none";

        replyText.value = "";

    }

});