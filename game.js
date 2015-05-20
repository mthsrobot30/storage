(function() {
  var ASTEROID_DELAY, ASTEROID_IMAGE, ASTEROID_INCREMENT, ASTEROID_NUMBER, ASTEROID_SPEED, Asteroid, BODY_PADDING, EXPLOSION_IMAGES, EXPLOSION_SOUND, Explosion, MISSILE_BUFFER, MISSILE_DELAY, MISSILE_IMAGE, MISSILE_LIFE, MISSILE_SOUND, MISSILE_SPEED, Missile, SCORE_INCREMENT, SHIP_IMAGE, SHIP_SPEED, Ship, Wrapper, canvas, i,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  SHIP_SPEED = 25;

  SCORE_INCREMENT = 5;

  MISSILE_SPEED = 30;

  MISSILE_DELAY = 25;

  MISSILE_BUFFER = 25;

  ASTEROID_SPEED = 15;

  ASTEROID_DELAY = 100;

  ASTEROID_NUMBER = 10;

  ASTEROID_INCREMENT = 5;

  MISSILE_LIFE = 180;

  BODY_PADDING = 8;

  SHIP_IMAGE = null;

  MISSILE_IMAGE = null;

  ASTEROID_IMAGE = null;

  EXPLOSION_IMAGES = null;

  EXPLOSION_SOUND = new Audio("explosion.wav");

  MISSILE_SOUND = new Audio("missile.wav");

  window.music = new Audio("music.ogg");

  Explosion = (function(_super) {
    __extends(Explosion, _super);

    function Explosion(x, y) {
      Explosion.__super__.constructor.call(this, EXPLOSION_IMAGES, x, y, 0, 0, 0, 2, 1);
    }

    return Explosion;

  })(canvasGames.Animation);

  Wrapper = (function(_super) {
    __extends(Wrapper, _super);

    function Wrapper() {
      return Wrapper.__super__.constructor.apply(this, arguments);
    }

    Wrapper.prototype.update = function() {
      if (this.x > canvasGames.screen.width) {
        this.x = 0;
      }
      if (this.x < -this.width) {
        return this.x = canvasGames.screen.width - this.width;
      }
    };

    return Wrapper;

  })(canvasGames.Sprite);

  Asteroid = (function(_super) {
    __extends(Asteroid, _super);

    function Asteroid() {
      var angle, dx, dy, x;
      angle = Math.min(Math.max(Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()), -.55), .55) * Math.PI / 2 + 3 * Math.PI / 2;
      x = Math.random() * canvasGames.screen.width;
      dx = Math.cos(angle) * ASTEROID_SPEED;
      dy = -Math.sin(angle) * ASTEROID_SPEED;
      Asteroid.__super__.constructor.call(this, ASTEROID_IMAGE, x, 0, dx, dy);
      this.y = -this.height;
    }

    Asteroid.prototype.update = function() {
      if (this.y > canvasGames.screen.height + this.height) {
        this.destroy();
      }
      return Asteroid.__super__.update.apply(this, arguments);
    };

    return Asteroid;

  })(Wrapper);

  Missile = (function(_super) {
    __extends(Missile, _super);

    function Missile(x, y, ship) {
      this.ship = ship;
      Missile.__super__.constructor.call(this, MISSILE_IMAGE, x, y, 0, -MISSILE_SPEED);
      this.life = MISSILE_LIFE;
    }

    Missile.prototype.update = function() {
      var sprite, _i, _len, _ref;
      this.life--;
      _ref = this.get_colliding_sprites();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        if (sprite instanceof Asteroid) {
          this.destroy();
          sprite.destroy();
          canvasGames.screen.addSprite(new Explosion(this.x, this.y));
          EXPLOSION_SOUND.play();
          this.ship.score += SCORE_INCREMENT;
          this.ship.score_ob.innerHTML = "Score: " + this.ship.score;
          this.ship.asteroid_count--;
          if (!this.ship.asteroid_count) {
            this.ship.new_level();
          }
          return;
        }
      }
      if (!this.life) {
        return this.destroy();
      }
    };

    return Missile;

  })(Wrapper);

  Ship = (function(_super) {
    __extends(Ship, _super);

    function Ship() {
      Ship.__super__.constructor.call(this, SHIP_IMAGE, canvasGames.screen.width / 2, canvasGames.screen.height - SHIP_IMAGE.height / 2 - 180);
      this.missile_counter = 0;
      this.asteroid_counter = ASTEROID_NUMBER;
      this.level = 1;
      this.score = 0;
      this.score_ob = document.getElementById("score");
    }

    Ship.prototype.update = function() {
      if (canvasGames.keyboard.isPressed(37)) {
        this.x -= SHIP_SPEED;
      }
      if (canvasGames.keyboard.isPressed(39)) {
        this.x += SHIP_SPEED;
      }
      this.missile_counter--;
      if (canvasGames.keyboard.isPressed(32) && this.missile_counter <= 0) {
        this.add_missile();
        this.missile_counter = MISSILE_DELAY;
      }
      this.asteroid_counter--;
      if (this.asteroid_counter <= 0) {
        this.add_asteroid(this);
        this.asteroid_counter = ASTEROID_DELAY;
      }
      return Ship.__super__.update.apply(this, arguments);
    };

    Ship.prototype.add_missile = function() {
      MISSILE_SOUND.play();
      return canvasGames.screen.addSprite(new Missile(this.x, this.y + this.height / 2 - MISSILE_BUFFER, this));
    };

    Ship.prototype.add_asteroid = function() {
      return canvasGames.screen.addSprite(new Asteroid);
    };

    return Ship;

  })(Wrapper);

  canvas = document.getElementById('canvas');

  canvas.width = window.innerWidth - BODY_PADDING * 2;

  canvas.height = window.innerHeight - BODY_PADDING * 2;

  canvasGames.init(canvas);

  canvasGames.loadImages.apply(canvasGames, ["bg.png", "spaceship.png", "light_missile.png", "asteroid.png"].concat(__slice.call((function() {
    var _i, _results;
    _results = [];
    for (i = _i = 1; _i <= 9; i = ++_i) {
      _results.push("explosion" + i + ".png");
    }
    return _results;
  })()), [function(images) {
    var spaceship;
    canvasGames.screen.setBackground(images.shift());
    SHIP_IMAGE = images[0], MISSILE_IMAGE = images[1], ASTEROID_IMAGE = images[2], EXPLOSION_IMAGES = 4 <= images.length ? __slice.call(images, 3) : [];
    spaceship = new Ship;
    canvasGames.screen.addSprite(spaceship);
    return canvasGames.screen.mainloop();
  }]));

  music.volume = .7;

  music.addEventListener('ended', function() {
    this.currentTime = 0;
    return this.play();
  }, false);

  music.play();

}).call(this);
