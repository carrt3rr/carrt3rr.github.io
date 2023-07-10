from PIL import Image, ImageSequence
import imageio

def generate_fractal(width, height, zoom):
    max_iterations = 100  # Maximum number of iterations

    # Create a blank image
    fractal_image = Image.new('RGB', (width, height), 'black')

    # Iterate over each pixel in the image
    for x in range(width):
        for y in range(height):
            # Map the pixel coordinates to the fractal's coordinate system
            real = (x - width / 2) * 4 / width / zoom
            imag = (y - height / 2) * 4 / height / zoom

            c = complex(real, imag)
            z = 0

            # Apply the Mandelbrot algorithm
            for i in range(max_iterations):
                z = z * z + c

                # If the magnitude of z exceeds 2, break the loop
                if abs(z) > 2:
                    break

            # Map the number of iterations to a color value
            color = (i % 8 * 32, i % 16 * 16, i % 32 * 8)

            # Set the pixel color in the fractal image
            fractal_image.putpixel((x, y), color)

    return fractal_image

# Dimensions of the output GIF
width = 400
height = 400

# Number of frames in the GIF
num_frames = 30

# Zoom factor
zoom_factor = 1.1

# Generate the fractal frames
frames = []

# Create a blank canvas
canvas = Image.new('RGB', (width, height), 'black')

for i in range(num_frames):
    # Calculate the zoom level
    zoom = zoom_factor ** i

    # Generate the fractal image for the current frame
    fractal_image = generate_fractal(width, height, zoom)

    # Paste the fractal image onto the canvas
    canvas.paste(fractal_image, (0, 0))

    # Append the current frame to the list
    frames.append(canvas.copy())

# Save the frames as a GIF
imageio.mimsave('infinite_fractal_zoom.gif', frames, duration=0.1)
