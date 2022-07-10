#
# Zum Erzeugen:
#   gnuplot diag-auswahlreaktion.gnuplot > ../../../assets/images/diag-auswahlreaktion.svg
#
set terminal svg

$data <<EOD
2   0.250   0.230
4   0.75    0.6
8   1.25    0.85
16  1.55    0.99
36  1.9     1.0
EOD

set table $Smooth
    set samples 40
    plot $data u 1:2 smooth bezier
    plot $data u 1:3 smooth bezier
unset table

set print $Paste
    N = |$Smooth|
    do for [i=1:N/2] {
        print $Smooth[i].$Smooth[i+N/2]
    }
set print

set xrange [2:36]
set logscale x
set xtics (0, 2, 4, 6, 8, 10, 12, 24, 36)
set grid x y mx
set xlabel "Anzahl Wahlmöglichkeiten"
set ylabel "Reaktionszeit (Sekunden)"

plot \
    $Paste using 1:2:5 w filledcurves fillstyle pattern 4 ti 'Übungseinfluß', \
    $data using 1:2 with linespoints smooth bezier lc "red" ti '', \
    $data using 1:3 with linespoints smooth bezier ti ''
