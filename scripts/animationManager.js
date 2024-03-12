export class animationManager{
    static isRunning = []
    static animateOnScreen = []
    static animateOnLoad = []
    static animateOnMouseOver = []
    static progressBar = document.querySelector("#globalProgressBar")

    static startManaging(){
        // Run onLoad animations
        this.animateOnLoad.forEach((anim)=>{
            this.runAnimation(anim)
        })
        
        // listen onScreen animations
        document.addEventListener('scroll', ()=>{
            this.animateOnScreen.forEach((anim)=>{
                if(anim[1].getBoundingClientRect().top <= window.innerHeight/2 && 
                anim[1].getBoundingClientRect().bottom >= window.innerHeight/2){
                    this.runAnimation(anim[0])
                } else {
                    this.pauseAnimation(anim[0])
                }
            })
        })

        // listen onMouseOver animations
        this.animateOnMouseOver.forEach((anim)=>{
            anim[1].addEventListener('mouseover', ()=>{
                this.runAnimation(anim[0])
            })
            anim[1].addEventListener('mouseleave', ()=>{
                this.pauseAnimation(anim[0])
            })
        })
    }

    static manage(animation, callbacks, container=null){
        if(this.checkAnimationPrototype(animation)){
            callbacks.forEach((callback)=>{
                callback(animation, container)
            })
        }
    }

    static onScreen(animation, container){
        if(container != null){
            animationManager.animateOnScreen.push([animation, container])
        } else { 
            console.error("onScreen event works with a container as parameter")
        }
    }
    static onLoad(animation){
        animationManager.animateOnLoad.push(animation)
    }
    static onMouseOver(animation, container){
        if(container != null){
            animationManager.animateOnMouseOver.push([animation, container])
        } else { 
            console.error("onMouseOver event works with a container as parameter")
        }
    }
    
    static addRunningAnimation(animation){
        if(this.isRunning.indexOf(animation) == -1){
            this.isRunning.push(animation)
        }
    }
    static removeRunningAnimation(animation){
        this.isRunning.splice(this.isRunning.indexOf(animation),1)
    }

    static runAnimation(animation){
        if(document.fullscreenElement == null){
            if(!animation.isAnimated){
                animation.isAnimated = true
                animation.resume()
                this.addRunningAnimation(animation)
            
                if(animation.alsoAnimate.length != 0){
                    animation.alsoAnimate.forEach((anim)=>{
                        this.runAnimation(anim)
                    })
                }
                if(animation.reverseAnimate.length != 0){
                    animation.reverseAnimate.forEach((anim)=>{
                        this.pauseAnimation(anim)
                    })
                }
            }
        }
    }
    static pauseAnimation(animation){
        if(animation.isAnimated){
            animation.isAnimated = false
            animation.pause()
            this.removeRunningAnimation(animation)

            if(animation.alsoAnimate.length != 0){
                animation.alsoAnimate.forEach((anim)=>{
                    this.pauseAnimation(anim)
                })
            }
            if(animation.reverseAnimate.length != 0){
                animation.reverseAnimate.forEach((anim)=>{
                    this.runAnimation(anim)
                })
            }
        }
    }

    static checkAnimationPrototype(animation){
        if(Object.getPrototypeOf(animation.constructor).name == "Animation"){
            return true
        } else {
            console.error("Animation must inherite from Animation prototype")
            return false
        }
    }
}

// Based class for animations
export class Animation{
    animation = null
    isAnimated = false
    reverseAnimate = []
    alsoAnimate = []

    resume(){
        // To overwrite
        console.error('resume method to overwrite')
    }
    pause(){
        // To overwrite
        console.error('pause method to overwrite')
    }

    dontAnimateWhenIsAnimated(animations){
        animations.forEach((animation)=>{
            if(animationManager.checkAnimationPrototype(animation)){
                if(this.checkAnimationsDependencies(animation)){
                    this.reverseAnimate.push(animation)
                }
            }
        })
    }
    animateWhenIsAnimated(animations){
        animations.forEach((animation)=>{
            if(animationManager.checkAnimationPrototype(animation)){
                if(this.checkAnimationsDependencies(animation)){
                    this.alsoAnimate.push(animation)
                }
            }
        })
    }

    checkAnimationsDependencies(animation){
        if(animation.reverseAnimate.indexOf(this) == -1 && animation.alsoAnimate.indexOf(this) == -1
        && this.reverseAnimate.indexOf(animation) == -1 && this.alsoAnimate.indexOf(animation) == -1){
            return true
        } else {
            console.error("Error when adding " + this.constructor.name + " dependency for " + animation.constructor.name + " : these animations are already dependent on each other")
        }
    }
}
