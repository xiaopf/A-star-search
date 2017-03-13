var s=30; 

var x=Math.floor(Math.random()*s),
    y=Math.floor(Math.random()*s);

var rX=Math.floor(Math.random()*s),
    rY=Math.floor(Math.random()*s);

var wall=[];

$(document).ready(function(){
  
    for (var i = 0; i < s; i++) {
        $("table")[0].innerHTML+='<tr class="'+'r'+i+'"></tr>';
        for (var j = 0; j < s; j++) {
            $("tr")[i].innerHTML+='<td class="'+'d'+j+' smallBox"></td>';
        }   
    }

    var a=true;
    var b=false;
    $('#drawWall').click(function(){
        a=true;
        b=false;
    });

    $('td').on('mousedown',function(){
        b=true;
        $('body').on('mouseup',function(){
            a= false;
        });
        $('td').on('mouseover',function(){
            if(a&&b){
                $(this).css({backgroundColor:'yellow'});
                wall.push([parseInt($(this).parent().attr('class').split('').slice(1).join('')),parseInt($(this).attr('class').split('').slice(1,3).join(''))]);
            }
        });
    });


  
    draw(x,y,'red')
    draw(rX,rY,'green')

    function draw(x,y,color){
        if(!color){color="blue";}
        x='.'+'r'+x;
        y='.'+'d'+y;
        $(x).find(y).css({backgroundColor:color});
    }

    function drawBody(arr,color){

        var i=0;
        var arrLen=arr.length;

        var timer=setInterval(function(){

            if(i<arrLen){
               draw(arr[i][0],arr[i][1],color); 
            }else{
               clearInterval(timer)
            }

            i++;

        },100);
    }  


    function isInArr(arr,aX,aY){
      var k;
      arr.forEach(function(item){
          if(item[0]==aX&&item[1]==aY){
              k=true;
          }
      });
      return k;
    }


    $('#ai').click(function(){

        var path=[];
        var openList=[];
        var closeList=[].concat(wall);

        var mX=x,mY=y;
       
        closeList.push([mX,mY]);
 
        while(!(mX==rX&&mY==rY)){

            if(mX-1!=-1&&mX-1!=s&&!isInArr(closeList,mX-1,mY)){
              openList.push([mX-1,mY,getF([mX-1,mY]),mX,mY,]);
            };

            if(mY+1!=-1&&mY+1!=s&&!isInArr(closeList,mX,mY+1)){
              openList.push([mX,mY+1,getF([mX,mY+1]),mX,mY,]);
            };

            if(mX+1!=-1&&mX+1!=s&&!isInArr(closeList,mX+1,mY)){
              openList.push([mX+1,mY,getF([mX+1,mY]),mX,mY,]);
            };

            if(mY-1!=-1&&mY-1!=s&&!isInArr(closeList,mX,mY-1)){
              openList.push([mX,mY-1,getF([mX,mY-1]),mX,mY,]);
            };
            
            function getF(arr){
                var G=Math.abs(arr[0]-x)+Math.abs(arr[1]-y);
                var H=Math.abs(arr[0]-rX)+Math.abs(arr[1]-rY);
                return [G,H,G+H];
            }
        
            var oLen=openList.length;

            openList.sort(function(a,b){
              return b[2][2]-a[2][2];
            });

            var openOut=openList.pop();

            drawBody([openOut],'orange');

            closeList.push(openOut);
            
            mX=openOut[0];
            mY=openOut[1];

        

        };

        var len=closeList.length;      
        path.unshift([rX,rY]);   
        path.unshift([closeList[len-1][3],closeList[len-1][4]]);

        var a=path[0][0];
        var b=path[0][1];
        var ss=0;

        while(!(a==x&&b==y)){

            for (var i = len-1-ss; i >=0; i--) {

              if(closeList[i][0]==a&&closeList[i][1]==b){
                  path.unshift([closeList[i][3],closeList[i][4]]);
                  ss=len-i;
                  break;
              }

            }

            a=path[0][0];
            b=path[0][1];
        }

        drawBody(path.slice(1,path.length-1),'grey');
 
    })
})