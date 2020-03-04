const Display = function(canvas) {
  this.context = canvas.getContext("2d");
  this.buffer = document.createElement("canvas").getContext("2d");

  this.clear = function() {
    this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  };

  this.render = function() {
    this.context.drawImage(
      this.buffer.canvas,
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  };

  this.resize = function(width, height, height_width_ratio) {
    if (height / width > height_width_ratio) {
      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;
    }

    this.context.imageSmoothingEnabled = false;
  };
};

Display.prototype = {
  drawTile: function(x, y, tile_size, color) {
    const oldFill = this.buffer.fillStyle;
    this.buffer.fillStyle = color;
    this.buffer.fillRect(x, y, tile_size, tile_size);
    this.buffer.fillStyle = oldFill;
  },
  drawFruit: function(tile_sheet, tile_sheet_columns, tile_size, fruit) {
    let dest_x = fruit.position.x;
    let dest_y = fruit.position.y;
    let sprite_x = (0 % tile_sheet_columns) * tile_size;
    let sprite_y = Math.floor(0 / tile_sheet_columns) * tile_size;

    this.buffer.drawImage(tile_sheet, sprite_x, sprite_y, 64, 64, dest_x, dest_y - 3, 16, 16);
  },
  drawSnake: function(tile_sheet, tile_sheet_columns, tile_size, segments) {
    const sprites = {
      turn_down_left: 6,
      turn_down_right: 1,
      turn_right_up: 6,
      turn_right_down: 4,
      turn_up_left: 4,
      turn_up_right: 2,
      turn_left_up: 1,
      turn_left_down: 2,
      body_left: 3,
      body_right: 3,
      body_up: 5,
      body_down: 5,
      head_left: 7,
      head_down: 8,
      head_right: 9,
      head_up: 10,
      tail_up: 11,
      tail_right: 12,
      tail_left: 13,
      tail_down: 14
    };

    for (let i = segments.length - 1; i > -1; i--) {
      let sprite = null;

      const curr = segments[i];
      const prev = segments[i - 1];

      let direction = curr.direction;

      if (i === segments.length - 1) {
        sprite = sprites[`tail_${direction}`];
      } else if (i === 0) {
        sprite = sprites[`head_${direction}`];
      } else {
        sprite = sprites[`body_${direction}`];
      }

      if (prev && curr) {
        if (curr.direction !== prev.direction) {
          sprite = sprites[`turn_${curr.direction}_${prev.direction}`];
        }
      }

      let dest_x = segments[i].x;
      let dest_y = segments[i].y;
      let sprite_x = (sprite % tile_sheet_columns) * tile_size;
      let sprite_y = Math.floor(sprite / tile_sheet_columns) * tile_size;

      this.buffer.drawImage(tile_sheet, sprite_x, sprite_y, 64, 64, dest_x, dest_y - 3, 16, 16);
    }
  }
};

export default Display;
