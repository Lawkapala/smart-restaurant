jQuery.extend(jQuery.fn,{validate:function(options){if(!this.length){options&&options.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing");return}var validator=jQuery.data(this[0],'validator');if(validator){return validator}validator=new jQuery.validator(options,this[0]);jQuery.data(this[0],'validator',validator);if(validator.settings.onsubmit){this.find(".cancel:submit").click(function(){validator.cancelSubmit=true});this.submit(function(event){if(validator.settings.debug)event.preventDefault();function handle(){if(validator.settings.submitHandler){validator.settings.submitHandler.call(validator,validator.currentForm);return false}return true}if(validator.cancelSubmit){validator.cancelSubmit=false;return handle()}if(validator.form()){if(validator.pendingRequest){validator.formSubmitted=true;return false}return handle()}else{validator.focusInvalid();return false}})}return validator},valid:function(){if(jQuery(this[0]).is('form')){return this.validate().form()}else{var valid=false;var validator=jQuery(this[0].form).validate();this.each(function(){valid|=validator.element(this)});return valid}},removeAttrs:function(attributes){var result={},$element=this;$.each(attributes.split(/\s/),function(){result[this]=$element.attr(this);$element.removeAttr(this)});return result},rules:function(command,argument){var element=this[0];if(command){var staticRules=jQuery.data(element.form,'validator').settings.rules;var existingRules=jQuery.validator.staticRules(element);switch(command){case"add":$.extend(existingRules,jQuery.validator.normalizeRule(argument));staticRules[element.name]=existingRules;break;case"remove":if(!argument){delete staticRules[element.name];return existingRules}var filtered={};$.each(argument.split(/\s/),function(index,method){filtered[method]=existingRules[method];delete existingRules[method]});return filtered}}var data=jQuery.validator.normalizeRules(jQuery.extend({},jQuery.validator.metadataRules(element),jQuery.validator.classRules(element),jQuery.validator.attributeRules(element),jQuery.validator.staticRules(element)),element);if(data.required){var param=data.required;delete data.required;data=$.extend({required:param},data)}return data},push:function(t){return this.setArray(this.add(t).get())}});jQuery.extend(jQuery.expr[":"],{blank:function(a){return!jQuery.trim(a.value)},filled:function(a){return!!jQuery.trim(a.value)},unchecked:function(a){return!a.checked}});jQuery.format=function(source,params){if(arguments.length==1)return function(){var args=jQuery.makeArray(arguments);args.unshift(source);return jQuery.format.apply(this,args)};if(arguments.length>2&&params.constructor!=Array){params=jQuery.makeArray(arguments).slice(1)}if(params.constructor!=Array){params=[params]}jQuery.each(params,function(i,n){source=source.replace(new RegExp("\\{"+i+"\\}","g"),n)});return source};jQuery.validator=function(options,form){this.settings=jQuery.extend({},jQuery.validator.defaults,options);this.currentForm=form;this.init()};jQuery.extend(jQuery.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",errorElement:"label",focusInvalid:true,errorContainer:jQuery([]),errorLabelContainer:jQuery([]),onsubmit:true,ignore:[],onfocusin:function(element){this.lastActive=element;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,element,this.settings.errorClass);this.errorsFor(element).hide()}},onfocusout:function(element){if(!this.checkable(element)&&(element.name in this.submitted||!this.optional(element))){this.element(element)}},onkeyup:function(element){if(element.name in this.submitted||element==this.lastElement){this.element(element)}},onclick:function(element){if(element.name in this.submitted)this.element(element)},highlight:function(element,errorClass){jQuery(element).addClass(errorClass)},unhighlight:function(element,errorClass){jQuery(element).removeClass(errorClass)}},setDefaults:function(settings){jQuery.extend(jQuery.validator.defaults,settings)},messages:{required:"Kjo fushe eshte e nevojshme.",remote:"Lutemi rregulloni fushen.",email:"Jepni nje email te vlefshme.",url:"Jepni nje URL te vlefshme.",date:"Jepni nje date te vlefshme.",dateISO:"Jepni nje date te vlefshme (ISO).",dateDE:"Bitte geben Sie ein gültiges Datum ein.",number:"Jepni nje numer te vlefshme.",numberDE:"Bitte geben Sie eine Nummer ein.",digits:"Jepni vetem numra.",creditcard:"Jepni nje karte krediti te vlefshme.",equalTo:"Shkruani dhe nje here te njejten vlere.",accept:"Jepni nje vlere me prapashtese te vlefshme.",maxlength:jQuery.format("Shkruani jo me shume se {0} karaktere."),maxLength:jQuery.format("Shkruani jo me shume se  {0} karaktere."),minlength:jQuery.format("Shkruani te pakten {0} karaktere."),minLength:jQuery.format("Shkruani jo me shume se  {0} karaktere."),rangelength:jQuery.format("Jepnji nje vlere mes {0} dhe {1} karaktere te gjate."),rangeLength:jQuery.format("Jepnji nje vlere mes {0} dhe {1} karaktere te gjate."),rangeValue:jQuery.format("Jepnji nje vlere mes{0} dhe {1}."),range:jQuery.format("Jepnji nje vlere mes {0} dhe {1}."),maxValue:jQuery.format("Jepnji nje vlere me te vogel ose te barabarte me {0}."),max:jQuery.format("Jepnji nje vlere me te vogel ose te barabarte me {0}."),minValue:jQuery.format("Jepnji nje vlere me te madhe ose te barabarte me {0}."),min:jQuery.format("Jepnji nje vlere me te madhe ose te barabarte me {0}.")},autoCreateRanges:false,prototype:{init:function(){this.labelContainer=jQuery(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||jQuery(this.currentForm);this.containers=jQuery(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var groups=(this.groups={});jQuery.each(this.settings.groups,function(key,value){jQuery.each(value.split(/\s/),function(index,name){groups[name]=key})});var rules=this.settings.rules;jQuery.each(rules,function(key,value){rules[key]=jQuery.validator.normalizeRule(value)});function delegate(event){var validator=jQuery.data(this[0].form,"validator");validator.settings["on"+event.type]&&validator.settings["on"+event.type].call(validator,this[0])}jQuery(this.currentForm).delegate("focusin focusout keyup",":text, :password, :file, select, textarea",delegate).delegate("click",":radio, :checkbox",delegate)},form:function(){this.checkForm();jQuery.extend(this.submitted,this.errorMap);this.invalid=jQuery.extend({},this.errorMap);if(!this.valid())jQuery(this.currentForm).triggerHandler("invalid-form.validate",[this]);this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var i=0,elements=this.elements();elements[i];i++){this.check(elements[i])}return this.valid()},element:function(element){element=this.clean(element);this.lastElement=element;this.prepareElement(element);var result=this.check(element);if(result){delete this.invalid[element.name]}else{this.invalid[element.name]=true}if(!this.numberOfInvalids()){this.toHide.push(this.containers)}this.showErrors();return result},showErrors:function(errors){if(errors){jQuery.extend(this.errorMap,errors);this.errorList=[];for(var name in errors){this.errorList.push({message:errors[name],element:this.findByName(name)[0]})}this.successList=jQuery.grep(this.successList,function(element){return!(element.name in errors)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){if(jQuery.fn.resetForm)jQuery(this.currentForm).resetForm();this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(obj){var count=0;for(var i in obj)count++;return count},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid){try{jQuery(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus()}catch(e){}}},findLastActive:function(){var lastActive=this.lastActive;return lastActive&&jQuery.grep(this.errorList,function(n){return n.element.name==lastActive.name}).length==1&&lastActive},elements:function(){var validator=this,rulesCache={};return jQuery([]).add(this.currentForm.elements).filter("input, select, textarea").not(":submit, :reset, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&validator.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in rulesCache||!validator.objectLength($(this).rules()))return false;rulesCache[this.name]=true;return true})},clean:function(selector){return jQuery(selector)[0]},errors:function(){return jQuery(this.settings.errorElement+"."+this.settings.errorClass,this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=jQuery([]);this.toHide=jQuery([]);this.formSubmitted=false},prepareForm:function(){this.reset();this.toHide=this.errors().push(this.containers)},prepareElement:function(element){this.reset();this.toHide=this.errorsFor(element)},check:function(element){element=this.clean(element);if(this.checkable(element)){element=this.findByName(element.name)[0]}var rules=$(element).rules();var dependencyMismatch=false;for(method in rules){var rule={method:method,parameters:rules[method]};try{var result=jQuery.validator.methods[method].call(this,jQuery.trim(element.value),element,rule.parameters);if(result=="dependency-mismatch"){dependencyMismatch=true;continue}dependencyMismatch=false;if(result=="pending"){this.toHide=this.toHide.not(this.errorsFor(element));return}if(!result){this.formatAndAdd(element,rule);return false}}catch(e){this.settings.debug&&window.console&&console.log("exception occured when checking element "+element.id+", check the '"+rule.method+"' method");throw e;}}if(dependencyMismatch)return;if(this.objectLength(rules))this.successList.push(element);return true},customMessage:function(name,method){var m=this.settings.messages[name];return m&&(m.constructor==String?m:m[method])},findDefined:function(){for(var i=0;i<arguments.length;i++){if(arguments[i]!==undefined)return arguments[i]}return undefined},defaultMessage:function(element,method){return this.findDefined(this.customMessage(element.name,method),element.title||undefined,jQuery.validator.messages[method],"<strong>Warning: No message defined for "+element.name+"</strong>")},formatAndAdd:function(element,rule){var message=this.defaultMessage(element,rule.method);if(typeof message=="function")message=message.call(this,rule.parameters,element);this.errorList.push({message:message,element:element});this.errorMap[element.name]=message;this.submitted[element.name]=message},addWrapper:function(toToggle){if(this.settings.wrapper)toToggle.push(toToggle.parents(this.settings.wrapper));return toToggle},defaultShowErrors:function(){for(var i=0;this.errorList[i];i++){var error=this.errorList[i];this.settings.highlight&&this.settings.highlight.call(this,error.element,this.settings.errorClass);this.showLabel(error.element,error.message)}if(this.errorList.length){this.toShow.push(this.containers)}if(this.settings.success){for(var i=0;this.successList[i];i++){this.showLabel(this.successList[i])}}if(this.settings.unhighlight){for(var i=0,elements=this.validElements();elements[i];i++){this.settings.unhighlight.call(this,elements[i],this.settings.errorClass)}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.elements().not(this.invalidElements())},invalidElements:function(){return jQuery(this.errorList).map(function(){return this.element})},showLabel:function(element,message){var label=this.errorsFor(element);if(label.length){label.removeClass().addClass(this.settings.errorClass);label.attr("generated")&&label.html(message)}else{label=jQuery("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(element),generated:true}).addClass(this.settings.errorClass).html(message||"");if(this.settings.wrapper){label=label.hide().show().wrap("<"+this.settings.wrapper+">").parent()}if(!this.labelContainer.append(label).length)this.settings.errorPlacement?this.settings.errorPlacement(label,jQuery(element)):label.insertAfter(element)}if(!message&&this.settings.success){label.text("");typeof this.settings.success=="string"?label.addClass(this.settings.success):this.settings.success(label)}this.toShow.push(label)},errorsFor:function(element){return this.errors().filter("[@for='"+this.idOrName(element)+"']")},idOrName:function(element){return this.groups[element.name]||(this.checkable(element)?element.name:element.id||element.name)},checkable:function(element){return/radio|checkbox/i.test(element.type)},findByName:function(name){var form=this.currentForm;return jQuery(document.getElementsByName(name)).map(function(index,element){return element.form==form&&element.name==name&&element||null})},getLength:function(value,element){switch(element.nodeName.toLowerCase()){case'select':return jQuery("option:selected",element).length;case'input':if(this.checkable(element))return this.findByName(element.name).filter(':checked').length}return value.length},depend:function(param,element){return this.dependTypes[typeof param]?this.dependTypes[typeof param](param,element):true},dependTypes:{"boolean":function(param,element){return param},"string":function(param,element){return!!jQuery(param,element.form).length},"function":function(param,element){return param(element)}},optional:function(element){return!jQuery.validator.methods.required.call(this,jQuery.trim(element.value),element)&&"dependency-mismatch"},startRequest:function(element){if(!this.pending[element.name]){this.pendingRequest++;this.pending[element.name]=true}},stopRequest:function(element,valid){this.pendingRequest--;if(this.pendingRequest<0)this.pendingRequest=0;delete this.pending[element.name];if(valid&&this.pendingRequest==0&&this.formSubmitted&&this.form()){jQuery(this.currentForm).submit()}},previousValue:function(element){return jQuery.data(element,"previousValue")||jQuery.data(element,"previousValue",previous={old:null,valid:true,message:this.defaultMessage(element,"remote")})}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(className,rules){className.constructor==String?this.classRuleSettings[className]=rules:jQuery.extend(this.classRuleSettings,className)},classRules:function(element){var rules={};var classes=jQuery(element).attr('class');classes&&jQuery.each(classes.split(' '),function(){if(this in jQuery.validator.classRuleSettings){jQuery.extend(rules,jQuery.validator.classRuleSettings[this])}});return rules},attributeRules:function(element){var rules={};var $element=jQuery(element);for(method in jQuery.validator.methods){var value=$element.attr(method);if(value!==undefined&&value!==''){rules[method]=value}}if(rules.maxlength&&/-1|2147483647|524288/.test(rules.maxlength)){delete rules.maxlength;delete rules.maxLength}return rules},metadataRules:function(element){if(!jQuery.metadata)return{};var meta=jQuery.data(element.form,'validator').settings.meta;return meta?jQuery(element).metadata()[meta]:jQuery(element).metadata()},staticRules:function(element){var rules={};var validator=jQuery.data(element.form,'validator');if(validator.settings.rules){rules=jQuery.validator.normalizeRule(validator.settings.rules[element.name])||{}}return rules},normalizeRules:function(rules,element){jQuery.each({minLength:'minlength',maxLength:'maxlength',rangeLength:'rangelength',minValue:'min',maxValue:'max',rangeValue:'range'},function(dep,curr){if(rules[dep]){rules[curr]=rules[dep];delete rules[dep]}});$.each(rules,function(prop,val){if(val===false){delete rules[prop];return}if(val.param||val.depends){var keepRule=true;switch(typeof val.depends){case"string":keepRule=!!jQuery(val.depends,element.form).length;break;case"function":keepRule=val.depends.call(element,element);break}if(keepRule){rules[prop]=val.param!==undefined?val.param:true}else{delete rules[prop]}}});jQuery.each(rules,function(rule,parameter){rules[rule]=jQuery.isFunction(parameter)?parameter(element):parameter});jQuery.each(['minlength','maxlength','min','max'],function(){if(rules[this]){rules[this]=Number(rules[this])}});jQuery.each(['rangelength','range'],function(){if(rules[this]){rules[this]=[Number(rules[this][0]),Number(rules[this][1])]}});if(jQuery.validator.autoCreateRanges){if(rules.min&&rules.max){rules.range=[rules.min,rules.max];delete rules.min;delete rules.max}if(rules.minlength&&rules.maxlength){rules.rangelength=[rules.minlength,rules.maxlength];delete rules.minlength;delete rules.maxlength}}return rules},normalizeRule:function(data){if(typeof data=="string"){var transformed={};jQuery.each(data.split(/\s/),function(){transformed[this]=true});data=transformed}return data},addMethod:function(name,method,message){jQuery.validator.methods[name]=method;jQuery.validator.messages[name]=message;if(method.length<3){jQuery.validator.addClassRules(name,jQuery.validator.normalizeRule(name))}},methods:{required:function(value,element,param){if(!this.depend(param,element))return"dependency-mismatch";switch(element.nodeName.toLowerCase()){case'select':var options=jQuery("option:selected",element);return options.length>0&&(element.type=="select-multiple"||(jQuery.browser.msie&&!(options[0].attributes['value'].specified)?options[0].text:options[0].value).length>0);case'input':if(this.checkable(element))return this.getLength(value,element)>0;default:return value.length>0}},remote:function(value,element,param){if(this.optional(element))return"dependency-mismatch";var previous=this.previousValue(element);if(!this.settings.messages[element.name])this.settings.messages[element.name]={};this.settings.messages[element.name].remote=typeof previous.message=="function"?previous.message(value):previous.message;if(previous.old!==value){previous.old=value;var validator=this;this.startRequest(element);var data={};data[element.name]=value;jQuery.ajax({url:param,mode:"abort",port:"validate"+element.name,dataType:"json",data:data,success:function(response){if(!response){var errors={};errors[element.name]=response||validator.defaultMessage(element,"remote");validator.showErrors(errors)}else{var submitted=validator.formSubmitted;validator.prepareElement(element);validator.formSubmitted=submitted;validator.successList.push(element);validator.showErrors()}previous.valid=response;validator.stopRequest(element,response)}});return"pending"}else if(this.pending[element.name]){return"pending"}return previous.valid},minlength:function(value,element,param){return this.optional(element)||this.getLength(value,element)>=param},minLength:function(value,element,param){return jQuery.validator.methods.minlength.apply(this,arguments)},maxlength:function(value,element,param){return this.optional(element)||this.getLength(value,element)<=param},maxLength:function(value,element,param){return jQuery.validator.methods.maxlength.apply(this,arguments)},rangelength:function(value,element,param){var length=this.getLength(value,element);return this.optional(element)||(length>=param[0]&&length<=param[1])},rangeLength:function(value,element,param){return jQuery.validator.methods.rangelength.apply(this,arguments)},min:function(value,element,param){return this.optional(element)||value>=param},minValue:function(){return jQuery.validator.methods.min.apply(this,arguments)},max:function(value,element,param){return this.optional(element)||value<=param},maxValue:function(){return jQuery.validator.methods.max.apply(this,arguments)},range:function(value,element,param){return this.optional(element)||(value>=param[0]&&value<=param[1])},rangeValue:function(){return jQuery.validator.methods.range.apply(this,arguments)},email:function(value,element){return this.optional(element)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(element.value)},url:function(value,element){return this.optional(element)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(element.value)},date:function(value,element){return this.optional(element)||!/Invalid|NaN/.test(new Date(value))},dateISO:function(value,element){return this.optional(element)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value)},dateDE:function(value,element){return this.optional(element)||/^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value)},number:function(value,element){return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)},numberDE:function(value,element){return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value)},digits:function(value,element){return this.optional(element)||/^\d+$/.test(value)},creditcard:function(value,element){if(this.optional(element))return"dependency-mismatch";if(/[^0-9-]+/.test(value))return false;var nCheck=0,nDigit=0,bEven=false;value=value.replace(/\D/g,"");for(n=value.length-1;n>=0;n--){var cDigit=value.charAt(n);var nDigit=parseInt(cDigit,10);if(bEven){if((nDigit*=2)>9)nDigit-=9}nCheck+=nDigit;bEven=!bEven}return(nCheck%10)==0},accept:function(value,element,param){param=typeof param=="string"?param:"png|jpe?g|gif";return this.optional(element)||value.match(new RegExp(".("+param+")$","i"))},equalTo:function(value,element,param){return value==jQuery(param).val()}}});(function($){var ajax=$.ajax;var pendingRequests={};$.ajax=function(settings){settings=jQuery.extend(settings,jQuery.extend({},jQuery.ajaxSettings,settings));var port=settings.port;if(settings.mode=="abort"){if(pendingRequests[port]){pendingRequests[port].abort()}return(pendingRequests[port]=ajax.apply(this,arguments))}return ajax.apply(this,arguments)}})(jQuery);(function($){$.each({focus:'focusin',blur:'focusout'},function(original,fix){$.event.special[fix]={setup:function(){if($.browser.msie)return false;this.addEventListener(original,$.event.special[fix].handler,true)},teardown:function(){if($.browser.msie)return false;this.removeEventListener(original,$.event.special[fix].handler,true)},handler:function(e){arguments[0]=$.event.fix(e);arguments[0].type=fix;return $.event.handle.apply(this,arguments)}}});$.extend($.fn,{delegate:function(type,delegate,handler){return this.bind(type,function(event){var target=$(event.target);if(target.is(delegate)){return handler.apply(target,arguments)}})},triggerEvent:function(type,target){return this.triggerHandler(type,[jQuery.event.fix({type:type,target:target})])}})})(jQuery);