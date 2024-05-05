"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Client_1 = require("./Client");
var Server_1 = require("./Server");
var ClientB = /** @class */ (function (_super) {
    __extends(ClientB, _super);
    function ClientB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientB.prototype.ping = function (name) {
        return "Hello, ".concat(name, ", I'm B!");
    };
    ClientB.prototype.ping2 = function () {
        return Promise.resolve("Hello, I'm B!");
    };
    __decorate([
        utils_1.RemoteHandler,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ClientB.prototype, "ping", null);
    __decorate([
        utils_1.RemoteHandler,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ClientB.prototype, "ping2", null);
    return ClientB;
}(Client_1.Client));
var server = new Server_1.Server(3000);
var a = new Client_1.Client("client-a", "http://localhost:3000");
var b = new ClientB("client-b", "http://localhost:3000");
var remoteClientB = a.use(ClientB, "client-b");
remoteClientB.ping("qwe").then(console.log);
remoteClientB.ping2().then(console.log);
