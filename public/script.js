function resizeHandler(){
    if(document.getElementById("sidebar")){
        var sideBar = document.getElementById("sidebar").classList;
        var container = document.getElementById("container").classList;
        var pageBody = document.getElementById("pageBody").classList;
        if(window.innerWidth > 768){
            if(!sideBar.contains("open")){
                sideBar.toggle("open");
            }
            if(!container.contains("fixed")){
                sideBar.toggle("fixed");
            }
            if(pageBody.contains("responsive")){
                pageBody.toggle("responsive");
            }
        }else{
            if(!pageBody.contains("responsive")){
                pageBody.toggle("responsive");
                if(sideBar.contains("open")){
                    sideBar.toggle("open");
                }
            }
        }
    }
}
window.addEventListener("resize", resizeHandler);
window.addEventListener("load", resizeHandler);
